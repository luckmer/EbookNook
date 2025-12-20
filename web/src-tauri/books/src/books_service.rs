use database::{DatabaseManager, INSERT_BOOK};

use crate::types::Book;

pub struct BooksManager {}

impl BooksManager {
    pub fn new() -> Self {
        BooksManager {}
    }

    //
    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        book: Book,
    ) -> Result<(), Box<dyn std::error::Error>> {
        println!("try to insert book");

        let conn = db.get_pool();

        sqlx::query(INSERT_BOOK)
            .bind(book.id)
            .bind(book.title)
            .bind(book.author)
            .bind(book.language)
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
