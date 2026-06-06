use std::error::Error;

use database::{DELETE_BOOK, DatabaseManager, GET_BOOK, GET_BOOKS, INSERT_BOOK};
use sqlx::Row;
use types::{FormatType, IBindingsBook, IBindingsRawBook};

pub struct LibraryService {}

impl LibraryService {
    pub fn new() -> Self {
        LibraryService {}
    }

    pub fn parse_book(
        &self,
        row: sqlx::sqlite::SqliteRow,
    ) -> Result<IBindingsRawBook, Box<dyn std::error::Error>> {
        let format_json: String = row.try_get("format")?;

        let format: FormatType = serde_json::from_str(&format_json)?;

        Ok(IBindingsRawBook {
            id: row.try_get("id")?,
            format,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
        })
    }

    pub async fn get_books(
        &self,
        db: &DatabaseManager,
    ) -> Result<Vec<IBindingsRawBook>, Box<dyn Error>> {
        let conn = db.get_pool();
        let raw_books = sqlx::query(GET_BOOKS).fetch_all(conn).await?;
        let mut books = Vec::new();

        for raw_book in raw_books {
            let book = self.parse_book(raw_book)?;

            books.push(IBindingsRawBook {
                format: book.format,
                created_at: book.created_at,
                updated_at: book.updated_at,
                id: book.id,
            });
        }
        Ok(books)
    }

    pub async fn book_exist(
        &self,
        db: &DatabaseManager,
        id: &str,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        let row = sqlx::query(GET_BOOK).bind(id).fetch_optional(conn).await?;
        Ok(row.is_some())
    }

    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        book: &IBindingsBook,
    ) -> Result<(), Box<dyn Error>> {
        let exist = self.book_exist(db, &book.id).await?;

        if exist {
            return Err("Book exist".into());
        }

        let conn = db.get_pool();

        let format = serde_json::to_string(&book.format)?;

        sqlx::query(INSERT_BOOK)
            .bind(&book.id)
            .bind(format)
            .bind(&book.updated_at)
            .bind(&book.created_at)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn delete_book(&self, db: &DatabaseManager, id: &str) -> Result<(), Box<dyn Error>> {
        let exist = self.book_exist(db, id).await?;

        if !exist {
            return Err("Book not found".into());
        }

        let conn = db.get_pool();
        sqlx::query(DELETE_BOOK).bind(id).execute(conn).await?;
        Ok(())
    }
}
