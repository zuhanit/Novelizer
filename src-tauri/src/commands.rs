use crate::models::{Document, Node};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{
    ffi::OsStr,
    fs,
    path::{Path, PathBuf},
    str::FromStr,
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

    // 임시 루트 노드 생성 (디렉토리 스캔용)
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

    // 루트 디렉토리의 자식들만 반환 (여러 루트 문서)
    Ok(root.children)
}

#[tauri::command]
#[specta::specta]
pub fn create_project(
    path: String,
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<Vec<FileNode>, String> {
    let project_path = PathBuf::from(&path);

    // 프로젝트 폴더명 추출
    let project_name = project_path
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or("Invalid project path")?
        .to_string();

    // 프로젝트 폴더 내에 루트 문서 생성 (ID 기반 파일명)
    Document::new(project_name.clone(), &project_path)
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

    // 루트 디렉토리의 자식들만 반환 (여러 루트 문서)
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

    // 현재 열려있는 프로젝트 경로 가져오기
    let project_path = state
        .project_path
        .as_ref()
        .ok_or("No project is currently open")?;

    // 프로젝트 이름 추출
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

    // 루트 디렉토리의 자식들만 반환 (여러 루트 문서)
    Ok(root.children)
}

pub fn scan_directory(directory_path: &Path, parent: &mut FileNode) -> Result<(), String> {
    for entry in
        fs::read_dir(directory_path).map_err(|e| format!("Failed to read directory: {}", e))?
    {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let entry_path = entry.path();

        if entry_path.is_dir() {
            let dir_name = entry_path
                .file_name()
                .and_then(|n| n.to_str())
                .ok_or("Invalid directory name")?;

            let json_file = entry_path.join(format!("{}.json", dir_name));

            // Document를 읽어서 name 추출
            if let Ok(doc) = Document::read(&json_file) {
                let metadata = FileMetadata {
                    path: json_file.to_string_lossy().to_string(),
                    name: doc.name,
                };

                let mut child = FileNode::new(metadata);
                scan_directory(&entry_path, &mut child)?;
                parent.add_child(child);
            }
        } else if entry_path.is_file() && entry_path.extension() == Some(OsStr::new("json")) {
            // Document를 읽어서 name 추출
            if let Ok(doc) = Document::read(&entry_path) {
                let metadata = FileMetadata {
                    path: entry_path.to_string_lossy().to_string(),
                    name: doc.name,
                };

                let child = FileNode::new(metadata);
                parent.add_child(child);
            }
        }
    }

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn create_document(parent: FileNode, name: String) -> Result<Document, String> {
    let parent_path = PathBuf::from(&parent.data.path);

    // 부모 경로가 파일이면 부모 디렉토리 추출, 디렉토리면 그대로 사용
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

    // Document::new_in()으로 폴더와 파일 동시 생성
    let doc = Document::new_in(name, &parent_dir)?;

    Ok(doc)
}

#[tauri::command]
#[specta::specta]
pub fn rename_document(mut document: Document, new_name: String) -> Result<Document, String> {
    document.rename(new_name)?;
    Ok(document) // 수정된 Document 반환
}

#[tauri::command]
#[specta::specta]
pub fn delete_document(document: Document) -> Result<(), String> {
    document.remove()
}
