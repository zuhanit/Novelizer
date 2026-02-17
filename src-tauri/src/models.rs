use std::{
    fs,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Document {
    id: Uuid, // private - 외부에서 수정 불가
    pub name: String,
    pub blocks: Vec<Block>,
}

impl Document {
    // ID getter - 읽기 전용 접근
    pub fn id(&self) -> Uuid {
        self.id
    }

    /**
     * Creates new Document in parent directory.
     */
    pub fn new(name: String, parent_directory: &Path) -> Result<Self, String> {
        if !parent_directory.is_dir() {
            return Err(format!("Path {:?} is not a directory", parent_directory));
        }

        let id = Uuid::new_v4();
        let file_path = parent_directory.join(format!("{}.json", id));

        let doc = Self {
            id,
            name,
            blocks: Vec::new(),
        };

        doc.save(&file_path)?;
        Ok(doc)
    }

    /**
     * Creates new Document and folder in parent directory.
     * Directory name uses the document's ID.
     */
    pub fn new_in(name: String, parent_directory: &Path) -> Result<Self, String> {
        if !parent_directory.is_dir() {
            return Err(format!("Path {:?} is not a directory", parent_directory));
        }

        let id = Uuid::new_v4();

        let new_dir = parent_directory.join(id.to_string());
        fs::create_dir_all(&new_dir)
            .map_err(|e| format!("Failed to create directory {:?}: {}", new_dir, e))?;

        let file_path = new_dir.join("document.json");

        let doc = Self {
            id,
            name,
            blocks: Vec::new(),
        };

        doc.save(&file_path)?;
        Ok(doc)
    }

    pub fn read(path: &Path) -> Result<Self, String> {
        let content =
            fs::read_to_string(path).map_err(|e| format!("Failed to read {:?}: {}", path, e))?;

        serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse JSON from {:?}: {}", path, e))
    }

    pub fn save(&self, path: &Path) -> Result<(), String> {
        let json = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize document: {}", e))?;

        fs::write(path, json)
            .map_err(|e| format!("Failed to write to {:?}: {}", path, e))?;

        Ok(())
    }

    /// Move a document's UUID directory to a new parent. Pure filesystem operation.
    pub fn move_doc(doc_path: &Path, new_parent_dir: &Path) -> Result<PathBuf, String> {
        let uuid_dir = doc_path
            .parent()
            .ok_or_else(|| format!("No parent directory for {:?}", doc_path))?;

        let uuid_dir_name = uuid_dir
            .file_name()
            .ok_or_else(|| format!("No directory name for {:?}", uuid_dir))?;

        let destination = new_parent_dir.join(uuid_dir_name);

        fs::rename(uuid_dir, &destination)
            .map_err(|e| format!("Failed to move {:?} to {:?}: {}", uuid_dir, destination, e))?;

        Ok(destination.join("document.json"))
    }

    pub fn remove(doc_path: &Path) -> Result<(), String> {
        let parent = doc_path
            .parent()
            .ok_or_else(|| format!("No parent directory for {:?}", doc_path))?;

        fs::remove_dir_all(parent)
            .map_err(|e| format!("Failed to remove directory {:?}: {}", parent, e))?;

        Ok(())
    }

    pub fn rename(&mut self, new_name: String) {
        self.name = new_name;
    }

    pub fn add_block(&mut self, kind: BlockKind, index: Option<u32>) -> Result<(), String> {
        let block = Block::new(kind);
        match index {
            Some(i) => {
                let i = i as usize;
                if i <= self.blocks.len() {
                    self.blocks.insert(i, block);
                } else {
                    return Err(format!(
                        "Index {} out of bounds (len: {})",
                        i,
                        self.blocks.len()
                    ));
                }
            }
            None => self.blocks.push(block),
        }
        Ok(())
    }

    pub fn delete_block(&mut self, block_id: &str) -> Result<(), String> {
        let len_before = self.blocks.len();
        self.blocks.retain(|b| b.id != block_id);
        if self.blocks.len() == len_before {
            return Err(format!("Block {} not found", block_id));
        }
        Ok(())
    }

    pub fn reorder_blocks(&mut self, start_index: u32, end_index: u32) -> Result<(), String> {
        let start = start_index as usize;
        let end = end_index as usize;
        if start >= self.blocks.len() {
            return Err(format!(
                "start_index {} out of bounds (len: {})",
                start,
                self.blocks.len()
            ));
        }
        if end >= self.blocks.len() {
            return Err(format!(
                "end_index {} out of bounds (len: {})",
                end,
                self.blocks.len()
            ));
        }
        let block = self.blocks.remove(start);
        self.blocks.insert(end, block);
        Ok(())
    }

    pub fn update_block_content(&mut self, block_id: &str, content: String) -> Result<(), String> {
        let block = self
            .blocks
            .iter_mut()
            .find(|b| b.id == block_id)
            .ok_or_else(|| format!("Block {} not found", block_id))?;
        block.update_content(content);
        Ok(())
    }

    pub fn change_block_kind(&mut self, block_id: &str, kind: BlockKind) -> Result<(), String> {
        let block = self
            .blocks
            .iter_mut()
            .find(|b| b.id == block_id)
            .ok_or_else(|| format!("Block {} not found", block_id))?;
        block.change_kind(kind);
        Ok(())
    }

    pub fn duplicate(doc_path: &Path) -> Result<Document, String> {
        let uuid_dir = doc_path
            .parent()
            .ok_or_else(|| format!("No UUID directory for {:?}", doc_path))?;
        let parent_dir = uuid_dir
            .parent()
            .ok_or_else(|| format!("No parent directory for {:?}", uuid_dir))?;

        let original = Self::read(doc_path)?;
        let copy_name = Self::next_copy_name(&original.name, parent_dir)?;

        let new_id = Uuid::new_v4();
        let new_uuid_dir = parent_dir.join(new_id.to_string());
        fs::create_dir_all(&new_uuid_dir)
            .map_err(|e| format!("Failed to create directory {:?}: {}", new_uuid_dir, e))?;

        let new_doc = Document {
            id: new_id,
            name: copy_name,
            blocks: clone_blocks(&original.blocks),
        };

        new_doc.save(&new_uuid_dir.join("document.json"))?;

        // 하위 디렉토리 재귀 복제
        Self::duplicate_children(uuid_dir, &new_uuid_dir)?;

        Ok(new_doc)
    }

    fn next_copy_name(original_name: &str, parent_dir: &Path) -> Result<String, String> {
        let mut sibling_names: Vec<String> = Vec::new();
        if let Ok(entries) = fs::read_dir(parent_dir) {
            for entry in entries.flatten() {
                let entry_path = entry.path();
                if entry_path.is_dir() {
                    let doc_file = entry_path.join("document.json");
                    if let Ok(doc) = Document::read(&doc_file) {
                        sibling_names.push(doc.name);
                    }
                }
            }
        }

        let prefix = format!("{} (", original_name);
        let mut max_num: u32 = 0;
        for name in &sibling_names {
            if let Some(rest) = name.strip_prefix(&prefix) {
                if let Some(num_str) = rest.strip_suffix(')') {
                    if let Ok(num) = num_str.parse::<u32>() {
                        if num > max_num {
                            max_num = num;
                        }
                    }
                }
            }
        }

        Ok(format!("{} ({:02})", original_name, max_num + 1))
    }

    fn duplicate_children(source_dir: &Path, dest_dir: &Path) -> Result<(), String> {
        let entries = fs::read_dir(source_dir)
            .map_err(|e| format!("Failed to read {:?}: {}", source_dir, e))?;

        for entry in entries.flatten() {
            let entry_path = entry.path();
            if !entry_path.is_dir() {
                continue;
            }

            let doc_file = entry_path.join("document.json");
            if !doc_file.exists() {
                continue;
            }

            let child_doc = Document::read(&doc_file)?;

            let child_new_id = Uuid::new_v4();
            let child_new_dir = dest_dir.join(child_new_id.to_string());
            fs::create_dir_all(&child_new_dir)
                .map_err(|e| format!("Failed to create {:?}: {}", child_new_dir, e))?;

            let new_child_doc = Document {
                id: child_new_id,
                name: child_doc.name,
                blocks: clone_blocks(&child_doc.blocks),
            };
            new_child_doc.save(&child_new_dir.join("document.json"))?;

            Self::duplicate_children(&entry_path, &child_new_dir)?;
        }

        Ok(())
    }

    pub fn validate(path: &Path) -> bool {
        let content = match fs::read_to_string(path) {
            Ok(c) => c,
            Err(_) => return false,
        };

        serde_json::from_str::<Document>(&content).is_ok()
    }
}

fn clone_blocks(blocks: &[Block]) -> Vec<Block> {
    blocks
        .iter()
        .map(|b| Block {
            id: Uuid::new_v4().to_string(),
            kind: b.kind.clone(),
            content: b.content.clone(),
            vcs_state: VCSState::Default,
        })
        .collect()
}

#[derive(Serialize, Deserialize, Type, Clone)]
#[serde(rename_all = "camelCase")]
pub enum BlockKind {
    Content,
    Memo,
}

#[derive(Default, Serialize, Deserialize, Type, Clone)]
#[serde(rename_all = "camelCase")]
pub enum VCSState {
    #[default]
    Default,
    Added,
    Modified,
    Removed,
}

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Block {
    pub id: String,
    pub kind: BlockKind,
    pub content: String,
    pub vcs_state: VCSState,
}

impl Block {
    pub fn new(kind: BlockKind) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            kind,
            content: String::new(),
            vcs_state: VCSState::Added,
        }
    }

    pub fn update_content(&mut self, content: String) {
        self.content = content;
        self.vcs_state = match self.vcs_state {
            VCSState::Added => VCSState::Added,
            _ => VCSState::Modified,
        };
    }

    pub fn change_kind(&mut self, kind: BlockKind) {
        self.kind = kind;
        self.vcs_state = match self.vcs_state {
            VCSState::Added => VCSState::Added,
            _ => VCSState::Modified,
        };
    }
}

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Node<T> {
    pub children: Vec<Node<T>>,
    pub data: T,
}

impl<T> Node<T> {
    pub fn new(data: T) -> Self {
        Self {
            children: Vec::new(),
            data,
        }
    }

    pub fn add_child(&mut self, child: Node<T>) {
        self.children.push(child);
    }

    pub fn remove_child(&mut self, index: usize) -> Option<Node<T>> {
        if index < self.children.len() {
            Some(self.children.remove(index))
        } else {
            None
        }
    }
}
