use state::AppState;
use tauri::State;
use types::IBindingsAnnotation;

#[tauri::command]
pub async fn add_annotation(
    state: State<'_, AppState>,
    annotation: IBindingsAnnotation,
) -> Result<(), String> {
    state
        .annotations_service
        .add_annotation(&state.db, annotation)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_annotations_by_book_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<Vec<IBindingsAnnotation>, String> {
    state
        .annotations_service
        .get_annotations_by_book_id(&state.db, id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_annotation(
    state: State<'_, AppState>,
    id: String,
    annotation_id: String,
) -> Result<(), String> {
    state
        .annotations_service
        .delete_annotation(&state.db, id, annotation_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_annotation(
    state: State<'_, AppState>,
    id: String,
    annotation_id: String,
) -> Result<(), String> {
    state
        .annotations_service
        .delete_annotation(&state.db, id, annotation_id)
        .await
        .map_err(|e| e.to_string())
}
