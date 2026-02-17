use serde::{Deserialize, Serialize};
use specta::Type;

use crate::models::Document;

#[derive(Debug, Clone, Serialize, Deserialize, Type, tauri_specta::Event)]
pub struct ProjectChanged;

#[derive(Clone, Serialize, Deserialize, Type, tauri_specta::Event)]
pub struct DocumentChanged {
    pub document: Document,
    pub kind: DocumentChangeKind,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub enum DocumentChangeKind {
    Deleted,
    Renamed,
    Moved { old_path: String, new_path: String },
}
