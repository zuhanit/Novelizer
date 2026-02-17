use crate::events::{DocumentChangeKind, DocumentChanged, ProjectChanged};
use crate::models::{BlockKind, Document, Node};
use tauri_specta::Event;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{
    fs,
    path::{Path, PathBuf},
    sync::Mutex,
};

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct FileMetadata {
    pub path: String, // PathBuf를 String으로 직렬화
    pub name: String, // Document.name
}

pub type FileNode = Node<FileMetadata>;

#[derive(Default)]
pub struct AppState {
    pub project_path: Option<PathBuf>,
}

#[tauri::command]
#[specta::specta]
pub fn open_project(
    path: String,
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<Vec<FileNode>, String> {
    let project_path = PathBuf::from(&path);

    let project_name = project_path
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or("Invalid project path")?
        .to_string();

    let root_metadata = FileMetadata {
        path: path.clone(),
        name: project_name,
    };

    let mut root = FileNode::new(root_metadata);
    scan_directory(&project_path, &mut root)?;

    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to acquire state lock: {}", e))?;
    state.project_path = Some(project_path);

    Ok(root.children)
}

#[tauri::command]
#[specta::specta]
pub fn create_project(
    path: String,
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<Vec<FileNode>, String> {
    let project_path = PathBuf::from(&path);

    let project_name = project_path
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or("Invalid project path")?
        .to_string();

    Document::new_in(project_name.clone(), &project_path)
        .map_err(|e| format!("Failed to create project document: {}", e))?;

    let root_metadata = FileMetadata {
        path: path.clone(),
        name: project_name,
    };

    let mut root = FileNode::new(root_metadata);
    scan_directory(&project_path, &mut root)?;

    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to acquire state lock: {}", e))?;
    state.project_path = Some(project_path);

    Ok(root.children)
}

#[tauri::command]
#[specta::specta]
pub fn scan_project_documents(
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<Vec<FileNode>, String> {
    let state = state
        .lock()
        .map_err(|_| "Failed to acquire state lock".to_string())?;

    let project_path = state
        .project_path
        .as_ref()
        .ok_or("No project is currently open")?;

    let project_name = project_path
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or("Invalid project path")?
        .to_string();

    let root_metadata = FileMetadata {
        path: project_path.to_string_lossy().to_string(),
        name: project_name,
    };

    let mut root = FileNode::new(root_metadata);
    scan_directory(project_path, &mut root)?;

    Ok(root.children)
}

pub fn scan_directory(directory_path: &Path, parent: &mut FileNode) -> Result<(), String> {
    for entry in
        fs::read_dir(directory_path).map_err(|e| format!("Failed to read directory: {}", e))?
    {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let entry_path = entry.path();

        if !entry_path.is_dir() {
            continue;
        }

        let doc_file = entry_path.join("document.json");

        if let Ok(doc) = Document::read(&doc_file) {
            let metadata = FileMetadata {
                path: doc_file.to_string_lossy().to_string(),
                name: doc.name,
            };

            let mut child = FileNode::new(metadata);
            scan_directory(&entry_path, &mut child)?;
            parent.add_child(child);
        }
    }

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn create_document(app: tauri::AppHandle, parent: FileNode, name: String) -> Result<Document, String> {
    let parent_path = PathBuf::from(&parent.data.path);

    let parent_dir = if parent_path.is_file() {
        parent_path
            .parent()
            .ok_or("Invalid parent path")?
            .to_path_buf()
    } else if parent_path.is_dir() {
        parent_path
    } else {
        return Err(format!("Invalid parent path: {:?}", parent_path));
    };

    let doc = Document::new_in(name, &parent_dir)?;

    let _ = ProjectChanged.emit(&app);

    Ok(doc)
}

#[tauri::command]
#[specta::specta]
pub fn rename_document(app: tauri::AppHandle, path: String, new_name: String) -> Result<Document, String> {
    let doc_path = PathBuf::from(&path);
    let mut doc = Document::read(&doc_path)?;
    doc.rename(new_name);
    doc.save(&doc_path)?;
    let _ = DocumentChanged { document: doc.clone(), kind: DocumentChangeKind::Renamed }.emit(&app);
    let _ = ProjectChanged.emit(&app);
    Ok(doc)
}

#[tauri::command]
#[specta::specta]
pub fn delete_document(app: tauri::AppHandle, path: String) -> Result<(), String> {
    let doc_path = PathBuf::from(&path);
    let doc = Document::read(&doc_path)?;
    Document::remove(&doc_path)?;
    let _ = DocumentChanged { document: doc, kind: DocumentChangeKind::Deleted }.emit(&app);
    let _ = ProjectChanged.emit(&app);
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn move_document(app: tauri::AppHandle, source_path: String, target_path: String) -> Result<(), String> {
    let source = PathBuf::from(&source_path);
    let target = PathBuf::from(&target_path);

    let source_uuid_dir = source
        .parent()
        .ok_or("Invalid source path: no parent directory")?;

    let target_parent_dir = target
        .parent()
        .ok_or("Invalid target path: no parent directory")?;

    if target_parent_dir.starts_with(source_uuid_dir) {
        return Err("Cannot move a document into its own subtree".to_string());
    }

    let new_doc_path = Document::move_doc(&source, target_parent_dir)?;
    let doc = Document::read(&new_doc_path)?;

    let _ = DocumentChanged {
        document: doc,
        kind: DocumentChangeKind::Moved {
            old_path: source_path,
            new_path: new_doc_path.to_string_lossy().to_string(),
        },
    }.emit(&app);
    let _ = ProjectChanged.emit(&app);

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn duplicate_document(app: tauri::AppHandle, path: String) -> Result<Document, String> {
    let doc_path = PathBuf::from(&path);
    let new_doc = Document::duplicate(&doc_path)?;
    let _ = ProjectChanged.emit(&app);
    Ok(new_doc)
}

#[tauri::command]
#[specta::specta]
pub fn open_document(path: String) -> Result<Document, String> {
    let doc_path = PathBuf::from(&path);
    Document::read(&doc_path)
}

#[tauri::command]
#[specta::specta]
pub fn save_document(document: Document, path: String) -> Result<(), String> {
    document.save(&PathBuf::from(&path))
}

#[tauri::command]
#[specta::specta]
pub fn add_block(
    mut document: Document,
    path: String,
    kind: BlockKind,
    index: Option<u32>,
) -> Result<Document, String> {
    document.add_block(kind, index)?;
    document.save(&PathBuf::from(&path))?;
    Ok(document)
}

#[tauri::command]
#[specta::specta]
pub fn delete_block(mut document: Document, path: String, block_id: String) -> Result<Document, String> {
    document.delete_block(&block_id)?;
    document.save(&PathBuf::from(&path))?;
    Ok(document)
}

#[tauri::command]
#[specta::specta]
pub fn reorder_blocks(
    mut document: Document,
    path: String,
    start_index: u32,
    end_index: u32,
) -> Result<Document, String> {
    document.reorder_blocks(start_index, end_index)?;
    document.save(&PathBuf::from(&path))?;
    Ok(document)
}

#[tauri::command]
#[specta::specta]
pub fn update_block_content(
    mut document: Document,
    path: String,
    block_id: String,
    content: String,
) -> Result<Document, String> {
    document.update_block_content(&block_id, content)?;
    document.save(&PathBuf::from(&path))?;
    Ok(document)
}

#[tauri::command]
#[specta::specta]
pub fn change_block_kind(
    mut document: Document,
    path: String,
    block_id: String,
    kind: BlockKind,
) -> Result<Document, String> {
    document.change_block_kind(&block_id, kind)?;
    document.save(&PathBuf::from(&path))?;
    Ok(document)
}
