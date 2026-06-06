use state::AppState;
use tauri::State;
use types::{IBindingsBook, IBindingsBookStructure, IBindingsMetadata, IBindingsProgress};

#[tauri::command]
pub async fn get_books(state: State<'_, AppState>) -> Result<Vec<IBindingsBook>, String> {
    state
        .library_core
        .get_books(&state.db)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_book_structure(
    state: State<'_, AppState>,
    id: String,
) -> Result<IBindingsBookStructure, String> {
    state
        .library_core
        .get_book_structure(&state.db, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_book(state: State<'_, AppState>, book: IBindingsBook) -> Result<(), String> {
    state
        .library_core
        .add_book(&state.db, &book)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_book(state: State<'_, AppState>, id: String) -> Result<(), String> {
    state
        .library_core
        .delete_book(&state.db, &id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_book_progress(
    state: State<'_, AppState>,
    progress: IBindingsProgress,
) -> Result<(), String> {
    state
        .library_core
        .update_book_progress(&state.db, progress)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_book_metadata(
    state: State<'_, AppState>,
    metadata: IBindingsMetadata,
) -> Result<(), String> {
    state
        .library_core
        .update_book_metadata(&state.db, metadata)
        .await
        .map_err(|e| e.to_string())
}
