use crate::DatabaseManager;

pub async fn init_database() -> DatabaseManager {
    DatabaseManager::new()
        .await
        .expect("Failed to initialize database")
}
