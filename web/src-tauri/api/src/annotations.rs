use state::AppState;
use tauri::State;
use types::{Highlight, Note};

#[tauri::command]
pub async fn get_highlights_structure_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<Vec<Highlight>, String> {
    state
        .annotations_service
        .get_highlights_by_id(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_notes_structure_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<Vec<Note>, String> {
    state
        .annotations_service
        .get_notes_by_id(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_note_structure(
    state: State<'_, AppState>,
    note: Note,
    id: String,
) -> Result<Note, String> {
    state
        .annotations_service
        .add_note(&state.db, note, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_highlight_structure(
    state: State<'_, AppState>,
    highlight: Highlight,
    id: String,
) -> Result<Highlight, String> {
    state
        .annotations_service
        .add_highlight(&state.db, highlight, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_note_by_id(
    state: State<'_, AppState>,
    book_id: String,
    id: String,
) -> Result<(), String> {
    state
        .annotations_service
        .delete_note(&state.db, id, book_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_highlight_by_id(
    state: State<'_, AppState>,
    book_id: String,
    id: String,
) -> Result<(), String> {
    state
        .annotations_service
        .delete_highlight(&state.db, id, book_id)
        .await
        .map_err(|e| e.to_string())
}
