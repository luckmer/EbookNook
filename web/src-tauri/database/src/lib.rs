pub mod db_commands;
pub mod db_service;
pub mod migrations;

pub use db_service::*;
pub use migrations::*;

pub async fn init_database() -> DatabaseManager {
    DatabaseManager::new()
        .await
        .expect("Failed to initialize database")
}
