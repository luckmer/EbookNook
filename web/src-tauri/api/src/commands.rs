use std::collections::HashMap;

use state::AppState;
use tauri::State;
use types::{Books, Epub, EpubStructure, NewEpubBookContent, Progress};

#[tauri::command]
pub async fn get_books(state: State<'_, AppState>) -> Result<Books, String> {
    state
        .format_service
        .get_books(&state.db)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_epub_book(state: State<'_, AppState>, epub: Epub) -> Result<(), String> {
    state
        .format_service
        .add_epub_book(&state.db, epub)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_epub_structure_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<EpubStructure, String> {
    state
        .format_service
        .get_epub_structure_by_id(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_epub_book_progress(
    state: State<'_, AppState>,
    id: String,
    progress: Progress,
) -> Result<(), String> {
    state
        .format_service
        .set_epub_book_progress(&state.db, id, progress)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_epub_book(state: State<'_, AppState>, id: String) -> Result<(), String> {
    state
        .format_service
        .delete_epub_book(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn edit_epub_book(
    state: State<'_, AppState>,
    id: String,
    content: HashMap<NewEpubBookContent, String>,
) -> Result<Epub, String> {
    state
        .format_service
        .edit_epub_book(&state.db, id, content)
        .await
        .map_err(|e| e.to_string())
}
