use state::AppState;
use tauri::State;
use types::{Books, FormatType, IBookStructure};

#[tauri::command]
pub async fn get_books(state: State<'_, AppState>) -> Result<Books, String> {
    state
        .format_service
        .get_books(&state.db)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_book_structure_by_id(
    state: State<'_, AppState>,
    id: String,
    format: FormatType,
) -> Result<IBookStructure, String> {
    state
        .format_service
        .get_book_structure_by_id(&state.db, id, format)
        .await
        .map_err(|e| e.to_string())
}
