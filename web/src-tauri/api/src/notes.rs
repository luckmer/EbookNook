use state::AppState;
use tauri::State;
use types::IBindingsNote;

#[tauri::command]
pub async fn add_note(state: State<'_, AppState>, note: IBindingsNote) -> Result<(), String> {
    state
        .notes_service
        .add_note(&state.db, note)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_notes_by_book_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<Vec<IBindingsNote>, String> {
    state
        .notes_service
        .get_notes_by_book_id(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_note(
    state: State<'_, AppState>,
    id: String,
    note_id: String,
) -> Result<(), String> {
    state
        .notes_service
        .delete_note(&state.db, id, note_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_note(state: State<'_, AppState>, note: IBindingsNote) -> Result<(), String> {
    state
        .notes_service
        .update_note(&state.db, note)
        .await
        .map_err(|e| e.to_string())
}
