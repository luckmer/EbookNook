use database::{
    DatabaseManager, INSERT_EPUB_BOOK, INSERT_EPUB_BOOK_SECTIONS, INSERT_EPUB_BOOK_TOC,
    SELECT_EPUB_BOOK_SECTION_BY_ID, SELECT_EPUB_BOOK_TOC_BY_ID,
    UPDATE_EPUB_BOOK_PERCENTAGE_PROGRESS, UPDATE_EPUB_BOOK_PROGRESS,
};
use sqlx::types::chrono;
use types::{
    FormatType, IBindingsEpubBook, IBindingsEpubBookStructure, IBindingsEpubMetadata,
    IBindingsEpubRendition, IBindingsEpubSection, IBindingsEpubToc,
};

pub struct EpubService {}

impl EpubService {
    pub fn new() -> Self {
        EpubService {}
    }

    pub async fn get_books(
        &self,
        db: &DatabaseManager,
    ) -> Result<Vec<IBindingsEpubBook>, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        let rows = sqlx::query("SELECT * FROM epub_books_table")
            .fetch_all(conn)
            .await?;

        let mut books = Vec::new();
        for row in rows {
            let epub = self.parse_book(row)?;
            books.push(epub);
        }

        Ok(books)
    }

    fn parse_book(
        &self,
        row: sqlx::sqlite::SqliteRow,
    ) -> Result<IBindingsEpubBook, Box<dyn std::error::Error>> {
        use sqlx::Row;

        let metadata: IBindingsEpubMetadata = serde_json::from_str(row.try_get("metadata")?)?;
        let rendition: IBindingsEpubRendition = serde_json::from_str(row.try_get("rendition")?)?;
        let progress: Vec<String> = serde_json::from_str(row.try_get("progress")?)?;
        let format: FormatType = serde_json::from_str(row.try_get("format")?)?;

        Ok(IBindingsEpubBook {
            metadata,
            rendition,
            percentage_progress: row.try_get("percentage_progress")?,
            progress,
            format,
            toc: None,
            sections: vec![],
            id: row.try_get("id")?,
        })
    }
    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        book: IBindingsEpubBook,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let metadata = serde_json::to_string(&book.metadata)?;

        let toc = serde_json::to_string(&book.toc)?;
        let sections = serde_json::to_string(&book.sections)?;
        let progress = serde_json::to_string(&book.progress)?;
        let rendition = serde_json::to_string(&book.rendition)?;
        let format = serde_json::to_string(&book.format)?;

        sqlx::query(INSERT_EPUB_BOOK)
            .bind(&book.id)
            .bind(metadata)
            .bind(rendition)
            .bind(&book.percentage_progress)
            .bind(progress)
            .bind(format)
            .execute(conn)
            .await?;

        sqlx::query(INSERT_EPUB_BOOK_TOC)
            .bind(&book.id)
            .bind(toc)
            .execute(conn)
            .await?;

        sqlx::query(INSERT_EPUB_BOOK_SECTIONS)
            .bind(&book.id)
            .bind(sections)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn set_book_progress(
        &self,
        db: &DatabaseManager,
        id: String,
        progress: Vec<String>,
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

    pub async fn set_book_percentage_progress(
        &self,
        db: &DatabaseManager,
        id: String,
        percentage_progress: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let now = chrono::Utc::now().timestamp();

        sqlx::query(UPDATE_EPUB_BOOK_PERCENTAGE_PROGRESS)
            .bind(percentage_progress)
            .bind(now)
            .bind(id)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn get_book_structure_by_id(
        &self,
        db: &DatabaseManager,
        id: &str,
    ) -> Result<IBindingsEpubBookStructure, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let toc_json: String = sqlx::query_scalar(SELECT_EPUB_BOOK_TOC_BY_ID)
            .bind(id)
            .fetch_one(conn)
            .await?;

        let chapters_json: String = sqlx::query_scalar(SELECT_EPUB_BOOK_SECTION_BY_ID)
            .bind(id)
            .fetch_one(conn)
            .await?;

        let toc: Option<Vec<IBindingsEpubToc>> = serde_json::from_str(&toc_json)?;
        let sections: Vec<IBindingsEpubSection> = serde_json::from_str(&chapters_json)?;

        Ok(IBindingsEpubBookStructure {
            toc,
            sections,
            format: FormatType::Epub,
        })
    }
}
