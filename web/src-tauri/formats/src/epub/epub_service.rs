use std::collections::HashMap;

use database::{
    DELETE_EPUB_TABLE, DatabaseManager, INSERT_EPUB_BOOK, INSERT_EPUB_CHAPTERS, INSERT_EPUB_TOC,
    SELECT_EPUB_CHAPTERS_BY_ID, SELECT_EPUB_TOC_BY_ID, UPDATE_EPUB_BOOK_PROGRESS,
};

use sqlx::types::chrono;
use types::{Book, Chapter, Epub, EpubStructure, Metadata, NewEpubBookContent, Progress, Toc};

pub struct EpubService {}

impl EpubService {
    pub fn new() -> Self {
        EpubService {}
    }

    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        epub: Epub,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        let book = &epub.book;

        let tags = book
            .tags
            .as_ref()
            .map(|t| serde_json::to_string(t))
            .transpose()?;
        let metadata = serde_json::to_string(&book.metadata)?;

        let toc = serde_json::to_string(&epub.toc)?;
        let chapters = serde_json::to_string(&epub.chapters)?;

        let progress = serde_json::to_string(&book.progress)?;

        sqlx::query(INSERT_EPUB_BOOK)
            .bind(&book.id)
            .bind(&book.url)
            .bind(&book.format)
            .bind(&book.title)
            .bind(&book.source_title)
            .bind(&book.author)
            .bind(&book.group_id)
            .bind(&book.group_name)
            .bind(tags)
            .bind(&book.cover_image_url)
            .bind(book.created_at)
            .bind(book.updated_at)
            .bind(book.deleted_at)
            .bind(book.uploaded_at)
            .bind(book.downloaded_at)
            .bind(book.cover_downloaded_at)
            .bind(book.last_updated)
            .bind(&book.primary_language)
            .bind(metadata)
            .bind(progress)
            .execute(conn)
            .await?;

        sqlx::query(INSERT_EPUB_TOC)
            .bind(&book.id)
            .bind(toc)
            .execute(conn)
            .await?;

        sqlx::query(INSERT_EPUB_CHAPTERS)
            .bind(&book.id)
            .bind(chapters)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn set_epub_book_progress(
        &self,
        db: &DatabaseManager,
        id: String,
        progress: Progress,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let new_progress = serde_json::to_string(&progress)?;

        let now = chrono::Utc::now().timestamp();

        sqlx::query(UPDATE_EPUB_BOOK_PROGRESS)
            .bind(new_progress)
            .bind(now)
            .bind(id)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn delete_epub_book(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        sqlx::query(DELETE_EPUB_TABLE)
            .bind(id)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn edit_epub_book(
        &self,
        db: &DatabaseManager,
        id: String,
        content: HashMap<NewEpubBookContent, String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        if content.is_empty() {
            return Ok(());
        }

        let conn = db.get_pool();
        let now = chrono::Utc::now().timestamp();

        let current_metadata_json: String =
            sqlx::query_scalar("SELECT metadata FROM epub_table WHERE id = ?")
                .bind(&id)
                .fetch_one(conn)
                .await?;

        let mut metadata: serde_json::Value = serde_json::from_str(&current_metadata_json)?;

        let metadata_obj = metadata.as_object_mut().ok_or("Invalid metadata format")?;

        let mut set_clauses = Vec::new();
        let mut bindings: Vec<String> = Vec::new();

        for (key, value) in content {
            match key {
                NewEpubBookContent::Title => {
                    set_clauses.push("title = ?");
                    bindings.push(value.clone());
                    metadata_obj
                        .insert("title".to_string(), serde_json::Value::String(value.clone()));
                }
                NewEpubBookContent::Author => {
                    set_clauses.push("author = ?");
                    bindings.push(value.clone());
                    metadata_obj
                        .insert("author".to_string(), serde_json::Value::String(value.clone()));
                }
                NewEpubBookContent::Description => {
                    metadata_obj
                        .insert("description".to_string(), serde_json::Value::String(value));
                }
                NewEpubBookContent::Published => {
                    metadata_obj.insert("published".to_string(), serde_json::Value::String(value));
                }
                NewEpubBookContent::Publisher => {
                    metadata_obj.insert("publisher".to_string(), serde_json::Value::String(value));
                }
            }
        }

        set_clauses.push("metadata = ?");
        bindings.push(serde_json::to_string(&metadata)?);

        set_clauses.push("last_updated = ?");
        bindings.push(now.to_string());

        let query = format!(
            "UPDATE epub_table SET {} WHERE id = ?",
            set_clauses.join(", ")
        );
        let mut sql_query = sqlx::query(&query);

        for binding in bindings {
            sql_query = sql_query.bind(binding);
        }

        sql_query.bind(id).execute(conn).await?;

        Ok(())
    }

    pub async fn get_books(
        &self,
        db: &DatabaseManager,
    ) -> Result<Vec<Epub>, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        let rows = sqlx::query("SELECT * FROM epub_table")
            .fetch_all(conn)
            .await?;

        let mut books = Vec::new();
        for row in rows {
            let epub = self.parse_book(row)?;
            books.push(epub);
        }

        Ok(books)
    }

    pub async fn get_epub_structure_by_id(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<EpubStructure, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let toc_json: String = sqlx::query_scalar(SELECT_EPUB_TOC_BY_ID)
            .bind(id.clone())
            .fetch_one(conn)
            .await?;

        let chapters_json: String = sqlx::query_scalar(SELECT_EPUB_CHAPTERS_BY_ID)
            .bind(id.clone())
            .fetch_one(conn)
            .await?;

        let toc: Vec<Toc> = serde_json::from_str(&toc_json)?;
        let chapters: Vec<Chapter> = serde_json::from_str(&chapters_json)?;

        Ok(EpubStructure { toc, chapters })
    }

    fn parse_book(&self, row: sqlx::sqlite::SqliteRow) -> Result<Epub, Box<dyn std::error::Error>> {
        use sqlx::Row;

        let tags: Option<Vec<String>> = row
            .try_get::<Option<String>, _>("tags")?
            .map(|s| serde_json::from_str(&s))
            .transpose()?;

        let metadata: Metadata = serde_json::from_str(row.try_get("metadata")?)?;
        let progress: Progress = serde_json::from_str(row.try_get("progress")?)?;

        Ok(Epub {
            book: Book {
                id: row.try_get("id")?,
                url: row.try_get("url")?,
                format: row.try_get("format")?,
                title: row.try_get("title")?,
                source_title: row.try_get("source_title")?,
                author: row.try_get("author")?,
                group_id: row.try_get("group_id")?,
                group_name: row.try_get("group_name")?,
                tags,
                cover_image_url: row.try_get("cover_image_url")?,
                created_at: row.try_get("created_at")?,
                updated_at: row.try_get("updated_at")?,
                deleted_at: row.try_get("deleted_at")?,
                uploaded_at: row.try_get("uploaded_at")?,
                downloaded_at: row.try_get("downloaded_at")?,
                cover_downloaded_at: row.try_get("cover_downloaded_at")?,
                last_updated: row.try_get("last_updated")?,
                primary_language: row.try_get("primary_language")?,
                metadata,
                progress,
            },
            toc: vec![],
            chapters: vec![],
        })
    }
}
