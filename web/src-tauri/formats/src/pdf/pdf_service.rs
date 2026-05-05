use std::collections::HashMap;

use database::{
    DELETE_PDF_TABLE, DatabaseManager, INSERT_PDF_BOOK, INSERT_PDF_BOOK_SECTIONS,
    INSERT_PDF_BOOK_TOC, SELECT_PDF_BOOK_SECTION_BY_ID, SELECT_PDF_BOOK_TOC_BY_ID,
    SELECT_PROGRESS_FROM_PDF, UPDATE_PDF_BOOK_PERCENTAGE_PROGRESS, UPDATE_PDF_BOOK_PROGRESS,
};
use sqlx::types::chrono;
use types::{
    FormatType, IBindingsBookContent, IBindingsPDFBook, IBindingsPDFBookStructure,
    IBindingsPDFMetadata, IBindingsPDFSection, IBindingsPDFToc, ProgressType,
};

pub struct PDFService {}

impl PDFService {
    pub fn new() -> Self {
        PDFService {}
    }

    pub async fn get_books(
        &self,
        db: &DatabaseManager,
    ) -> Result<Vec<IBindingsPDFBook>, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        let rows = sqlx::query("SELECT * FROM pdf_books_table")
            .fetch_all(conn)
            .await?;

        let mut books = Vec::new();
        for row in rows {
            let pdf = self.parse_book(row)?;
            books.push(pdf);
        }

        Ok(books)
    }

    fn parse_book(
        &self,
        row: sqlx::sqlite::SqliteRow,
    ) -> Result<IBindingsPDFBook, Box<dyn std::error::Error>> {
        use sqlx::Row;

        let metadata: IBindingsPDFMetadata = serde_json::from_str(row.try_get("metadata")?)?;
        let progress: HashMap<ProgressType, String> =
            serde_json::from_str(row.try_get("progress")?)?;
        let format: FormatType = serde_json::from_str(row.try_get("format")?)?;
        let created_at: String = serde_json::from_str(row.try_get("created_at")?)?;
        let updated_at: String = serde_json::from_str(row.try_get("updated_at")?)?;

        Ok(IBindingsPDFBook {
            metadata,
            created_at,
            updated_at,
            percentage_progress: row.try_get("percentage_progress")?,
            progress,
            format,
            sections: vec![],
            toc: None,
            id: row.try_get("id")?,
        })
    }

    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        book: IBindingsPDFBook,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let metadata = serde_json::to_string(&book.metadata)?;
        let sections = serde_json::to_string(&book.sections)?;
        let progress = serde_json::to_string(&book.progress)?;
        let created_at = serde_json::to_string(&book.created_at)?;
        let updated_at = serde_json::to_string(&book.updated_at)?;
        let format = serde_json::to_string(&book.format)?;
        let toc = serde_json::to_string(&book.toc)?;

        sqlx::query(INSERT_PDF_BOOK)
            .bind(&book.id)
            .bind(metadata)
            .bind(&book.percentage_progress)
            .bind(progress)
            .bind(format)
            .bind(created_at)
            .bind(updated_at)
            .execute(conn)
            .await?;

        sqlx::query(INSERT_PDF_BOOK_TOC)
            .bind(&book.id)
            .bind(toc)
            .execute(conn)
            .await?;

        sqlx::query(INSERT_PDF_BOOK_SECTIONS)
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
        progress: HashMap<ProgressType, String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        if progress.is_empty() {
            return Ok(());
        }

        let conn = db.get_pool();

        let raw: String = sqlx::query_scalar(SELECT_PROGRESS_FROM_PDF)
            .bind(&id)
            .fetch_one(conn)
            .await?;

        let mut existing: serde_json::Value = serde_json::from_str(&raw)?;
        let existing_map = existing
            .as_object_mut()
            .ok_or("Progress is not a JSON object")?;

        for (key, value) in progress {
            let key_str = serde_json::to_value(&key)?
                .as_str()
                .ok_or("Failed to serialize ProgressType key")?
                .to_string();

            existing_map.insert(key_str, serde_json::Value::String(value));
        }

        let now = chrono::Utc::now().timestamp();
        sqlx::query(UPDATE_PDF_BOOK_PROGRESS)
            .bind(serde_json::to_string(&existing)?)
            .bind(&id)
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

        sqlx::query(UPDATE_PDF_BOOK_PERCENTAGE_PROGRESS)
            .bind(percentage_progress)
            .bind(id)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn get_book_structure_by_id(
        &self,
        db: &DatabaseManager,
        id: &str,
    ) -> Result<IBindingsPDFBookStructure, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let chapters_json: String = sqlx::query_scalar(SELECT_PDF_BOOK_SECTION_BY_ID)
            .bind(id)
            .fetch_optional(conn)
            .await?
            .ok_or_else(|| format!("No PDF book sections found for id: '{}'", id))?;

        let toc_json: String = sqlx::query_scalar(SELECT_PDF_BOOK_TOC_BY_ID)
            .bind(id)
            .fetch_optional(conn)
            .await?
            .ok_or_else(|| format!("No PDF book toc found for id: '{}'", id))?;

        let sections: Vec<IBindingsPDFSection> = serde_json::from_str(&chapters_json)?;
        let toc: Option<Vec<IBindingsPDFToc>> = serde_json::from_str(&toc_json)?;

        Ok(IBindingsPDFBookStructure {
            sections,
            toc,
            format: FormatType::Pdf,
        })
    }
    pub async fn delete_book(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        sqlx::query(DELETE_PDF_TABLE).bind(id).execute(conn).await?;

        Ok(())
    }

    pub async fn update_book_metadata(
        &self,
        db: &DatabaseManager,
        id: String,
        content: HashMap<IBindingsBookContent, String>,
    ) -> Result<IBindingsPDFBook, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        if content.is_empty() {
            let row = sqlx::query("SELECT * FROM pdf_books_table WHERE id = ?")
                .bind(id)
                .fetch_one(conn)
                .await?;
            return Ok(self.parse_book(row)?);
        }
        let current_metadata_json: String =
            sqlx::query_scalar("SELECT metadata FROM pdf_books_table WHERE id = ?")
                .bind(&id)
                .fetch_one(conn)
                .await?;
        let mut metadata: serde_json::Value = serde_json::from_str(&current_metadata_json)?;
        let metadata_obj = metadata.as_object_mut().ok_or("Invalid metadata format")?;

        for (key, value) in content {
            match key {
                IBindingsBookContent::Title => {
                    metadata_obj.insert("title".to_string(), serde_json::Value::String(value));
                }
                IBindingsBookContent::Author => {
                    metadata_obj.insert("author".to_string(), serde_json::Value::String(value));
                }
                IBindingsBookContent::Description => {
                    metadata_obj
                        .insert("description".to_string(), serde_json::Value::String(value));
                }
                IBindingsBookContent::Published => {
                    metadata_obj.insert("published".to_string(), serde_json::Value::String(value));
                }
                IBindingsBookContent::Publisher => {
                    metadata_obj.insert("publisher".to_string(), serde_json::Value::String(value));
                }
            }
        }

        sqlx::query("UPDATE pdf_books_table SET metadata = ? WHERE id = ?")
            .bind(serde_json::to_string(&metadata)?)
            .bind(&id)
            .execute(conn)
            .await?;

        let row = sqlx::query("SELECT * FROM pdf_books_table WHERE id = ?")
            .bind(id)
            .fetch_one(conn)
            .await?;
        Ok(self.parse_book(row)?)
    }
}
