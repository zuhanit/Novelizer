use axum::{Json, http::StatusCode};
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Deserialize)]
pub struct InitRequest {
    pub path: String,
}

#[derive(Deserialize)]
pub struct CommitRequest {
    pub path: String,
    pub message: String,
}

#[derive(Serialize)]
pub struct VcsResponse {
    pub ok: bool,
}

pub async fn init(Json(body): Json<InitRequest>) -> (StatusCode, Json<VcsResponse>) {
    match vcs::init(Path::new(&body.path)).await {
        Ok(_) => (StatusCode::OK, Json(VcsResponse { ok: true })),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, Json(VcsResponse { ok: false })),
    }
}

pub async fn commit(Json(body): Json<CommitRequest>) -> (StatusCode, Json<VcsResponse>) {
    match vcs::commit(Path::new(&body.path), &body.message).await {
        Ok(_) => (StatusCode::OK, Json(VcsResponse { ok: true })),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, Json(VcsResponse { ok: false })),
    }
}
