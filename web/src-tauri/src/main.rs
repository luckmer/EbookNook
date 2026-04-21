// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use database::init_database;
use formats::init_format_service;
use state::AppState;
use tauri::PhysicalSize;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let handle = app.handle();

            tauri::async_runtime::block_on(async {
                let db_manager = init_database(handle).await;

                let state = AppState {
                    format_service: init_format_service(),
                    db: db_manager,
                };

                app.manage(state);
            });

            let main_window = app.get_webview_window("main").unwrap();

            main_window
                .set_min_size(Some(PhysicalSize {
                    width: 360,
                    height: 600,
                }))
                .unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            api::books::get_book_structure_by_id,
            api::books::get_books,
            api::books::add_book,
            api::books::set_book_progress,
            api::books::delete_book,
            api::books::set_book_percentage_progress,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
