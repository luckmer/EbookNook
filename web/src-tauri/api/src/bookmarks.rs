use state::AppState;
use tauri::State;
use types::IBindingsBookmark;

#[tauri::command]
pub async fn get_bookmarks_by_book_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<Vec<IBindingsBookmark>, String> {
    state
        .bookmarks_service
        .get_bookmarks_by_book_id(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_bookmark_by_book_id(
    state: State<'_, AppState>,
    payload: IBindingsBookmark,
) -> Result<(), String> {
    state
        .bookmarks_service
        .add_bookmark_by_book_id(&state.db, payload)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_bookmark_by_book_id(
    state: State<'_, AppState>,
    payload: IBindingsBookmark,
) -> Result<(), String> {
    state
        .bookmarks_service
        .update_bookmark_by_book_id(&state.db, payload)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_bookmark_by_book_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    state
        .bookmarks_service
        .delete_bookmark_by_book_id(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}
