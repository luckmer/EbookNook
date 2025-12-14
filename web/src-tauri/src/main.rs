// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use database::{init_database, DatabaseManager};

pub struct AppState {
    db: DatabaseManager,
}

fn main() {
    let db_manager = tauri::async_runtime::block_on(async { init_database().await });

    let state = AppState { db: db_manager };

    tauri::Builder::default()
        .manage(state)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
