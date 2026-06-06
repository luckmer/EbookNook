// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use bookmarks::init_bookmarks_service;
use database::init_database;
use library::init_core_library_service;
use notes::init_notes_service;
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
                    library_core: init_core_library_service(),
                    bookmarks_service: init_bookmarks_service(),
                    notes_service: init_notes_service(),
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
            api::notes::add_note,
            api::notes::get_notes_by_book_id,
            api::notes::delete_note,
            api::notes::update_note,
            api::bookmarks::get_bookmarks_by_book_id,
            api::bookmarks::add_bookmark_by_book_id,
            api::bookmarks::update_bookmark_by_book_id,
            api::bookmarks::delete_bookmark_by_book_id,
            api::library::update_book_progress,
            api::library::get_books,
            api::library::get_book_structure,
            api::library::add_book,
            api::library::delete_book,
            api::library::update_book_progress
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
