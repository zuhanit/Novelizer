mod commands;
mod events;
mod models;

use std::sync::Mutex;

use specta_typescript::Typescript;
use tauri::Manager;
use tauri_specta::{collect_commands, collect_events, Builder};

use crate::commands::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![
        commands::open_project,
        commands::create_project,
        commands::create_document,
        commands::rename_document,
        commands::open_document,
        commands::save_document,
        commands::add_block,
        commands::delete_block,
        commands::reorder_blocks,
        commands::update_block_content,
        commands::change_block_kind,
        commands::delete_document,
        commands::scan_project_documents,
        commands::move_document,
        commands::duplicate_document,
    ]).events(collect_events![
        events::ProjectChanged,
        events::DocumentChanged,
    ]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/types/rust/bindings.ts")
        .expect("Failed to export TypeScript bindings");

    let invoke_handler = builder.invoke_handler();

    tauri::Builder::default()
        .setup(move |app| {
            builder.mount_events(app);
            app.manage(Mutex::new(AppState::default()));
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(invoke_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
