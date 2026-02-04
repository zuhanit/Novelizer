// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};

#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    let mut idx = 1;
    idx += 1;

    format!("Hello, {}! You've been greeted from Rust!, {}", name, idx)
}

#[tauri::command]
#[specta::specta]
fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![add,]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/types/rust/bindings.ts")
        .expect("Failed to export TypeScript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, add])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
