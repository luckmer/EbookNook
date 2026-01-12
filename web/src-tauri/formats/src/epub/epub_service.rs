use database::{DatabaseManager, INSERT_EPUB_BOOK};

use types::{Book, Chapter, Epub, Metadata, Toc};

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
            .bind(&book.hash)
            .bind(&book.root_file_path)
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
            .bind(toc)
            .bind(chapters)
            .execute(conn)
            .await?;
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

    fn parse_book(&self, row: sqlx::sqlite::SqliteRow) -> Result<Epub, Box<dyn std::error::Error>> {
        use sqlx::Row;

        let tags: Option<Vec<String>> = row
            .try_get::<Option<String>, _>("tags")?
            .map(|s| serde_json::from_str(&s))
            .transpose()?;

        let metadata: Metadata = serde_json::from_str(row.try_get("metadata")?)?;
        let toc: Vec<Toc> = serde_json::from_str(row.try_get("toc")?)?;
        let chapters: Vec<Chapter> = serde_json::from_str(row.try_get("chapters")?)?;
        let progress: Vec<String> = serde_json::from_str(row.try_get("progress")?)?;

        Ok(Epub {
            book: Book {
                id: row.try_get("id")?,
                url: row.try_get("url")?,
                hash: row.try_get("hash")?,
                root_file_path: row.try_get("root_file_path")?,
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
            toc,
            chapters,
        })
    }
}
