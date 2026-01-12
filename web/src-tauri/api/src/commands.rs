use database::AppState;
use formats::init_format_service;
use tauri::State;
use types::Books;

#[tauri::command]
pub async fn get_books(state: State<'_, AppState>) -> Result<Books, String> {
    let service = init_format_service();

    service
        .get_books(&state.db)
        .await
        .map_err(|e| e.to_string())
}
