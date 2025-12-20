use std::fs;
use std::path::PathBuf;

use crate::EPUB_TABLE;
use sqlx::{SqlitePool, sqlite::SqlitePoolOptions};

pub struct DatabaseManager {
    pool: SqlitePool,
}

impl DatabaseManager {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let db_path = if cfg!(debug_assertions) {
            PathBuf::from("database/database.db")
        } else {
            PathBuf::from("database/database.db")
        };

        Self::ensure_db_file_exists(&db_path);

        let database_url = db_path
            .to_str()
            .expect("Failed to convert database path to string");

        let pool = SqlitePoolOptions::new().connect(&database_url).await?;

        let database = DatabaseManager { pool };
        database.run_migrations().await?;
        Ok(database)
    }

    async fn run_migrations(&self) -> Result<(), Box<dyn std::error::Error>> {
        let _ = sqlx::query("PRAGMA foreign_keys = ON;")
            .execute(&self.pool)
            .await;

        sqlx::query(EPUB_TABLE).execute(&self.pool).await?;

        Ok(())
    }

    pub fn get_pool(&self) -> &SqlitePool {
        &self.pool
    }

    fn ensure_db_file_exists(db_path: &PathBuf) {
        if db_path.exists() {
            return;
        }

        let db_dir = db_path.parent().expect("Failed to get parent directory");

        if !db_dir.exists() {
            fs::create_dir_all(db_dir).expect("Failed to create database directory");
        }

        fs::File::create(db_path).expect("Failed to create database file");
    }
}
