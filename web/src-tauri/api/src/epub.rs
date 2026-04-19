use state::AppState;
use tauri::State;
use types::{FormatType, IBookStructure, IBookType};

#[tauri::command]
pub async fn add_book(state: State<'_, AppState>, book: IBookType) -> Result<(), String> {
    state
        .format_service
        .add_book(&state.db, book)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_book_progress(
    state: State<'_, AppState>,
    id: String,
    progress: Vec<String>,
    format: FormatType,
) -> Result<(), String> {
    state
        .format_service
        .set_book_progress(&state.db, id, progress, format)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_book_percentage_progress(
    state: State<'_, AppState>,
    id: String,
    percentage_progress: String,
    format: FormatType,
) -> Result<(), String> {
    state
        .format_service
        .set_book_percentage_progress(&state.db, id, percentage_progress, format)
        .await
        .map_err(|e| e.to_string())
}
