mod commands;
mod models;

use std::sync::Mutex;

use specta_typescript::Typescript;
use tauri::Manager;
use tauri_specta::{collect_commands, Builder};

use crate::commands::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![
        commands::open_project,
        commands::create_project,
        commands::create_document,
        commands::rename_document,
    ]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/types/rust/bindings.ts")
        .expect("Failed to export TypeScript bindings");

    tauri::Builder::default()
        .setup(|app| {
            app.manage(Mutex::new(AppState::default()));
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
