// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use api::commands;
use database::{service::init_database, structs::AppState};

fn main() {
    let db_manager = tauri::async_runtime::block_on(async { init_database().await });

    let state = AppState { db: db_manager };

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::get_books,commands::add_epub_book,commands::get_epub_structure_by_id])
        .manage(state)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
