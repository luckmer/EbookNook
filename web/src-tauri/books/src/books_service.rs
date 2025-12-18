use database::{BOOKS_TABLE, DatabaseManager, INSERT_BOOK};

use crate::types::Book;

pub struct BooksManager {}

impl BooksManager {
    pub fn new() -> Self {
        BooksManager {}
    }

    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        book: Book,
    ) -> Result<(), Box<dyn std::error::Error>> {
        println!(" got book  {:?}", book);
        let conn = db.get_connection();

        println!(" got book  {:?}", book);

        conn.execute(
            INSERT_BOOK,
            (book.clone().id, book.title, book.author, book.language),
        )
        .await?;

        eprintln!("inserted book id={}", "3232");

        let mut rows = conn
            .query("SELECT id, title, author, language FROM books", ())
            .await?;

        let mut debug_rows = Vec::new();

        while let Some(row) = rows.next().await? {
            debug_rows.push((
                row.get::<i64>(0)?,
                row.get::<String>(1)?,
                row.get::<String>(2)?,
                row.get::<String>(3)?,
            ));
        }

        eprintln!("rows = {:#?}", debug_rows);

        Ok(())
    }

    pub async fn remove_book(
        &self,
        db: &DatabaseManager,
    ) -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }

    pub async fn get_books(&self, db: &DatabaseManager) -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }
}
