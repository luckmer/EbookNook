use crate::DatabaseManager;
use tauri::AppHandle;

pub async fn init_database(handle: &AppHandle) -> DatabaseManager {
    DatabaseManager::new(handle)
        .await
        .expect("Failed to initialize database")
}
