use crate::{ANNOTATIONS_TABLE, EPUB_BOOK_TABLE, EPUB_CHAPTERS_TABLE, EPUB_TOC_TABLE};
use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous};
use sqlx::{Pool, Sqlite, SqlitePool};
use std::fs;
use std::str::FromStr;
use tauri::{AppHandle, Manager};

pub struct DatabaseManager {
    pub pool: Pool<Sqlite>,
}

impl DatabaseManager {
    pub async fn new(app_handle: &AppHandle) -> Result<Self, Box<dyn std::error::Error>> {
        let app_dir = app_handle.path().app_data_dir()?;

        if !app_dir.exists() {
            fs::create_dir_all(&app_dir)?;
        }

        let db_path = app_dir.join("database.sqlite");
        let db_url = format!(
            "sqlite:{}",
            db_path.to_str().ok_or("Invalid path encoding")?
        );

        let options = SqliteConnectOptions::from_str(&db_url)?
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

    async fn run_migrations(&self) -> Result<(), Box<dyn std::error::Error>> {
        sqlx::query("PRAGMA foreign_keys = ON;")
            .execute(&self.pool)
            .await?;
        sqlx::query(EPUB_BOOK_TABLE).execute(&self.pool).await?;
        sqlx::query(EPUB_TOC_TABLE).execute(&self.pool).await?;
        sqlx::query(EPUB_CHAPTERS_TABLE).execute(&self.pool).await?;
        sqlx::query(ANNOTATIONS_TABLE).execute(&self.pool).await?;

        Ok(())
    }

    pub fn get_pool(&self) -> &SqlitePool {
        &self.pool
    }
}
