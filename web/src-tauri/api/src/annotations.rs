use state::AppState;
use tauri::State;
use types::Annotation;

#[tauri::command]
pub async fn add_annotation_structure(
    state: State<'_, AppState>,
    annotation: Annotation,
    id: String,
) -> Result<Annotation, String> {
    state
        .annotations_service
        .add_annotation(&state.db, annotation, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_annotations_structure_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<Vec<Annotation>, String> {
    state
        .annotations_service
        .get_annotations_by_id(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_annotation_by_id(
    state: State<'_, AppState>,
    book_id: String,
    id: String,
) -> Result<(), String> {
    state
        .annotations_service
        .delete_annotation(&state.db, id, book_id)
        .await
        .map_err(|e| e.to_string())
}
