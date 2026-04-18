// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// use annotations::init_annotations_service;
// use database::service::init_database;
// use formats::init_format_service;
use state::AppState;
use tauri::PhysicalSize;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let handle = app.handle();

            // tauri::async_runtime::block_on(async {
            //     let db_manager = init_database(handle).await;

            //     let state = AppState {
            //         annotations_service: init_annotations_service(),
            //         format_service: init_format_service(),
            //         db: db_manager,
            //     };

            //     app.manage(state);
            // });

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
            // api::books::get_books,
            // api::epub::add_epub_book,
            // api::epub::get_epub_structure_by_id,
            // api::epub::set_epub_book_progress,
            // api::epub::delete_epub_book,
            // api::epub::edit_epub_book,
            // api::annotations::add_note_structure,
            // api::annotations::delete_note_by_id,
            // api::annotations::get_notes_structure_by_id,
            // api::annotations::get_highlights_structure_by_id,
            // api::annotations::delete_highlight_by_id,
            // api::annotations::add_highlight_structure,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
