use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous};
use sqlx::{Pool, Sqlite, SqlitePool};
use std::fs;
use std::str::FromStr;
use tauri::{AppHandle, Manager};

use crate::{
    BOOKMARKS_TABLE, BOOKS_TABLE, METADATA_TABLE, NOTES_TABLE, PROGRESS_TABLE, SECTIONS_TABLE,
    TOCS_TABLE,
};

pub struct DatabaseManager {
    pub pool: Pool<Sqlite>,
}

impl DatabaseManager {
    pub async fn new_from_url(db_url: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let options = SqliteConnectOptions::from_str(db_url)?
            .create_if_missing(true)
            .foreign_keys(true)
            .journal_mode(SqliteJournalMode::Wal)
            .synchronous(SqliteSynchronous::Normal)
            .busy_timeout(std::time::Duration::from_secs(5));

        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect_with(options)
            .await?;

        let database = DatabaseManager { pool };
        database.run_migrations().await?;

        Ok(database)
    }

    pub async fn new(app_handle: &AppHandle) -> Result<Self, Box<dyn std::error::Error>> {
        let base_dir = app_handle.path().app_data_dir()?;
        let db_dir = base_dir.join("eBookNook").join("database");

        if !db_dir.exists() {
            fs::create_dir_all(&db_dir)?;
        }

        let db_path = db_dir.join("database.sqlite");
        let db_url = format!(
            "sqlite:{}",
            db_path.to_str().ok_or("Invalid path encoding")?
        );

        Self::new_from_url(&db_url).await
    }

    async fn run_migrations(&self) -> Result<(), Box<dyn std::error::Error>> {
        sqlx::query("PRAGMA foreign_keys = ON;")
            .execute(&self.pool)
            .await?;

        sqlx::query(BOOKMARKS_TABLE).execute(&self.pool).await?;
        sqlx::query(NOTES_TABLE).execute(&self.pool).await?;
        sqlx::query(TOCS_TABLE).execute(&self.pool).await?;
        sqlx::query(SECTIONS_TABLE).execute(&self.pool).await?;
        sqlx::query(PROGRESS_TABLE).execute(&self.pool).await?;
        sqlx::query(METADATA_TABLE).execute(&self.pool).await?;
        sqlx::query(BOOKS_TABLE).execute(&self.pool).await?;

        Ok(())
    }

    pub fn get_pool(&self) -> &SqlitePool {
        &self.pool
    }
}
