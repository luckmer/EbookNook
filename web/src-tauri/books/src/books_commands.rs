use crate::{BooksManager, Epub};
use database::AppState;
use tauri::State;

#[tauri::command]
pub async fn add_book(state: State<'_, AppState>, book: Epub) -> Result<(), String> {
    let manager = BooksManager::new();

    manager
        .add_book(&state.db, book)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn remove_book(state: State<AppState>) {
    // manager().remove_book(&state.db);
}

#[tauri::command]
pub fn get_books(state: State<AppState>) {
    // manager().get_books(&state.db);
}
