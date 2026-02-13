use std::{
    fs,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Document {
    id: Uuid,  // private - 외부에서 수정 불가
    pub name: String,
    pub blocks: Vec<Block>,
    pub path: PathBuf,
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
        // directory가 실제로 디렉토리인지 검증
        if !parent_directory.is_dir() {
            return Err(format!("Path {:?} is not a directory", parent_directory));
        }

        let id = Uuid::new_v4();
        let file_path = parent_directory.join(format!("{}.json", id));

        let doc = Self {
            id: id,
            name: name,
            blocks: Vec::new(),
            path: file_path.clone(),
        };

        // ID를 파일명으로 사용

        let json = serde_json::to_string_pretty(&doc)
            .map_err(|e| format!("Failed to serialize document: {}", e))?;

        fs::write(&file_path, json)
            .map_err(|e| format!("Failed to write to {:?}: {}", file_path, e))?;

        Ok(doc)
    }

    /**
     * Creates new Document and folder in parent directory.
     * Directory name uses the document's ID.
     */
    pub fn new_in(name: String, parent_directory: &Path) -> Result<Self, String> {
        // parent_directory가 디렉토리인지 검증
        if !parent_directory.is_dir() {
            return Err(format!("Path {:?} is not a directory", parent_directory));
        }

        let id = Uuid::new_v4();

        let new_dir = parent_directory.join(id.to_string());
        fs::create_dir_all(&new_dir)
            .map_err(|e| format!("Failed to create directory {:?}: {}", new_dir, e))?;

        // 서브디렉토리 안에 Document 파일 저장
        let file_path = new_dir.join(format!("{}.json", id));

        // Document 생성 (ID 생성)
        let doc = Self {
            id: id,
            name,
            blocks: Vec::new(),
            path: file_path.clone(),
        };

        let json = serde_json::to_string_pretty(&doc)
            .map_err(|e| format!("Failed to serialize document: {}", e))?;

        fs::write(&file_path, json)
            .map_err(|e| format!("Failed to write to {:?}: {}", file_path, e))?;

        Ok(doc)
    }

    pub fn read(path: &Path) -> Result<Self, String> {
        let content =
            fs::read_to_string(path).map_err(|e| format!("Failed to read {:?}: {}", path, e))?;

        serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse JSON from {:?}: {}", path, e))
    }

    pub fn rename(&mut self, new_name: String) -> Result<(), String> {
        self.name = new_name;
        self.save()
    }

    pub fn save(&self) -> Result<(), String> {
        let json = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize document: {}", e))?;

        fs::write(&self.path, json)
            .map_err(|e| format!("Failed to write to {:?}: {}", self.path, e))?;

        Ok(())
    }

    pub fn remove(&self) -> Result<(), String> {
        // JSON 파일 삭제
        fs::remove_file(&self.path)
            .map_err(|e| format!("Failed to remove file {:?}: {}", self.path, e))?;

        // new_in()으로 생성된 경우 디렉토리도 삭제
        if let Some(parent) = self.path.parent() {
            if let Some(dir_name) = parent.file_name().and_then(|n| n.to_str()) {
                // 부모 디렉토리 이름이 Document ID와 같으면 new_in()으로 생성된 것
                if dir_name == self.id.to_string() {
                    fs::remove_dir_all(parent)
                        .map_err(|e| format!("Failed to remove directory {:?}: {}", parent, e))?;
                }
            }
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

#[derive(Serialize, Deserialize, Type, Clone)]
pub enum BlockKind {
    Content,
    Memo,
}

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Block {
    pub id: String,
    pub kind: BlockKind,
    pub content: String,
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
