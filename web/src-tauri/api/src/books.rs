use state::AppState;
use tauri::State;
use types::{Books, FormatType, IAddBookType, IBookMetadata, IBookStructure, IBookType};

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

#[tauri::command]
pub async fn add_book(state: State<'_, AppState>, book: IAddBookType) -> Result<(), String> {
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

#[tauri::command]
pub async fn delete_book(
    state: State<'_, AppState>,
    id: String,
    format: FormatType,
) -> Result<(), String> {
    state
        .format_service
        .delete_book(&state.db, id, format)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_book_metadata(
    state: State<'_, AppState>,
    id: String,
    metadata: IBookMetadata,
) -> Result<IBookType, String> {
    state
        .format_service
        .update_book_metadata(&state.db, id, metadata)
        .await
        .map_err(|e| e.to_string())
}
