use state::AppState;
use tauri::State;
use types::Books;

#[tauri::command]
pub async fn get_books(state: State<'_, AppState>) -> Result<Books, String> {
    state
        .format_service
        .get_books(&state.db)
        .await
        .map_err(|e| e.to_string())
}
