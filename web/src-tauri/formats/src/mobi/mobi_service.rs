use std::collections::HashMap;

use database::{
    DELETE_MOBI_TABLE, DatabaseManager, INSERT_MOBI_BOOK, INSERT_MOBI_BOOK_SECTIONS,
    INSERT_MOBI_BOOK_TOC, SELECT_MOBI_BOOK_SECTION_BY_ID, SELECT_MOBI_BOOK_TOC_BY_ID,
};
use sqlx::types::chrono;
use types::{
    FormatType, IBindingsBookContent, IBindingsMobiBook, IBindingsMobiBookStructure,
    IBindingsMobiMetadata, IBindingsMobiSection, IBindingsMobiToc,
};

pub struct MobiService {}

impl MobiService {
    pub fn new() -> Self {
        MobiService {}
    }

    pub async fn get_books(
        &self,
        db: &DatabaseManager,
    ) -> Result<Vec<IBindingsMobiBook>, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        let rows = sqlx::query("SELECT * FROM mobi_books_table")
            .fetch_all(conn)
            .await?;

        let mut books = Vec::new();
        for row in rows {
            let mobi = self.parse_book(row)?;
            books.push(mobi);
        }

        Ok(books)
    }

    fn parse_book(
        &self,
        row: sqlx::sqlite::SqliteRow,
    ) -> Result<IBindingsMobiBook, Box<dyn std::error::Error>> {
        use sqlx::Row;

        let metadata: IBindingsMobiMetadata = serde_json::from_str(row.try_get("metadata")?)?;
        let progress: HashMap<String, String> = serde_json::from_str(row.try_get("progress")?)?;
        let format: FormatType = serde_json::from_str(row.try_get("format")?)?;

        Ok(IBindingsMobiBook {
            metadata,
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
        book: IBindingsMobiBook,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let metadata = serde_json::to_string(&book.metadata)?;

        let toc = serde_json::to_string(&book.toc)?;
        let sections = serde_json::to_string(&book.sections)?;
        let progress = serde_json::to_string(&book.progress)?;
        let format = serde_json::to_string(&book.format)?;

        sqlx::query(INSERT_MOBI_BOOK)
            .bind(&book.id)
            .bind(metadata)
            .bind(&book.percentage_progress)
            .bind(progress)
            .bind(format)
            .execute(conn)
            .await?;

        sqlx::query(INSERT_MOBI_BOOK_TOC)
            .bind(&book.id)
            .bind(toc)
            .execute(conn)
            .await?;

        sqlx::query(INSERT_MOBI_BOOK_SECTIONS)
            .bind(&book.id)
            .bind(sections)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn get_book_structure_by_id(
        &self,
        db: &DatabaseManager,
        id: &str,
    ) -> Result<IBindingsMobiBookStructure, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        let toc_json: String = sqlx::query_scalar(SELECT_MOBI_BOOK_TOC_BY_ID)
            .bind(id)
            .fetch_one(conn)
            .await?;

        let chapters_json: String = sqlx::query_scalar(SELECT_MOBI_BOOK_SECTION_BY_ID)
            .bind(id)
            .fetch_one(conn)
            .await?;

        let toc: Option<Vec<IBindingsMobiToc>> = serde_json::from_str(&toc_json)?;
        let sections: Vec<IBindingsMobiSection> = serde_json::from_str(&chapters_json)?;

        Ok(IBindingsMobiBookStructure {
            toc,
            sections,
            format: FormatType::Mobi,
        })
    }

    pub async fn delete_book(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        sqlx::query(DELETE_MOBI_TABLE)
            .bind(id)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn update_book_metadata(
        &self,
        db: &DatabaseManager,
        id: String,
        content: HashMap<IBindingsBookContent, String>,
    ) -> Result<IBindingsMobiBook, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        if content.is_empty() {
            let row = sqlx::query("SELECT * FROM mobi_books_table WHERE id = ?")
                .bind(id)
                .fetch_one(conn)
                .await?;
            return Ok(self.parse_book(row)?);
        }
        
        let current_metadata_json: String =
            sqlx::query_scalar("SELECT metadata FROM mobi_books_table WHERE id = ?")
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

        sqlx::query("UPDATE mobi_books_table SET metadata = ? WHERE id = ?")
            .bind(serde_json::to_string(&metadata)?)
            .bind(&id)
            .execute(conn)
            .await?;

        let row = sqlx::query("SELECT * FROM mobi_books_table WHERE id = ?")
            .bind(id)
            .fetch_one(conn)
            .await?;
        Ok(self.parse_book(row)?)
    }
}
