use database::AppState;
use formats::init_format_service;
use tauri::State;
use types::{Books, Epub, EpubStructure};

#[tauri::command]
pub async fn get_books(state: State<'_, AppState>) -> Result<Books, String> {
    let service = init_format_service();

    service
        .get_books(&state.db)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_epub_book(state: State<'_, AppState>, epub: Epub) -> Result<(), String> {
    let service = init_format_service();

    service
        .add_epub_book(&state.db, epub)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_epub_structure_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<EpubStructure, String> {
    let service = init_format_service();

    service
        .get_epub_structure_by_id(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}
