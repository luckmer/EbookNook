use database::{DatabaseManager, INSERT_EPUB_BOOK};

use crate::types::Epub;

pub struct BooksManager {}

impl BooksManager {
    pub fn new() -> Self {
        BooksManager {}
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

        let progress =serde_json::to_string(&book.progress)?;

        sqlx::query(INSERT_EPUB_BOOK)
            .bind(&book.id)
            .bind(&book.url)
            .bind(&book.hash)
            .bind(&book.root_file_path)
            .bind(&book.format)
            .bind(&book.title)
            .bind(&book.source_title)
            .bind(&book.author)
            .bind(&book.group)
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
            .bind(toc)
            .bind(chapters)
            .execute(conn)
            .await?;
        Ok(())
    }

    pub async fn remove_book(
        &self,
        db: &DatabaseManager,
        book_id: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }

    pub async fn get_books(&self, db: &DatabaseManager) {}

    pub async fn get_book_by_id(&self, db: &DatabaseManager, book_id: &str) {}
}
