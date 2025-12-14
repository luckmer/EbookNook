use crate::migrations::{books::BOOKS_TABLE, chapters::CHAPTERS_TABLE, toc::TOC_TABLE};
use std::fs;
use std::path::PathBuf;
use turso::Builder;

pub struct DatabaseManager {
    db: turso::Database,
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

        let db = Builder::new_local(database_url).build().await?;

        let database = DatabaseManager { db };

        database.run_migrations().await?;

        Ok(database)
    }

    pub fn get_connection(&self) -> turso::Connection {
        self.db.connect().expect("Failed to establish connection")
    }

    async fn run_migrations(&self) -> Result<(), Box<dyn std::error::Error>> {
        let conn = self.get_connection();

        conn.execute("PRAGMA foreign_keys = ON;", ()).await?;

        conn.execute(BOOKS_TABLE, ()).await?;
        conn.execute(CHAPTERS_TABLE, ()).await?;
        conn.execute(TOC_TABLE, ()).await?;

        Ok(())
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
