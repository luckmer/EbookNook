use database::{DatabaseManager, INSERT_BOOK};

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
        let conn = db.get_connection();


        conn.execute(
            INSERT_BOOK,
            (book.id, book.title, book.author, book.language),
        )
        .await?;


        let mut rows = conn
            .query("SELECT id, title, author, language FROM books", ())
            .await?;

        let mut debug_rows = Vec::new();

        while let Some(row) = rows.next().await? {
            debug_rows.push((
                row.get::<String>(0)?,
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
        book_id: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_connection();
        
        conn.execute("DELETE FROM toc WHERE book_id = ?", (book_id,))
            .await?;
        
        conn.execute("DELETE FROM chapters WHERE book_id = ?", (book_id,))
            .await?;
        
        conn.execute("DELETE FROM books WHERE id = ?", (book_id,))
            .await?;
        
        
        Ok(())
    }

    pub async fn get_books(
        &self,
        db: &DatabaseManager,
    ) -> Result<Vec<Book>, Box<dyn std::error::Error>> {
        let conn = db.get_connection();
        
        let mut rows = conn
            .query("SELECT id, title, author, language FROM books ORDER BY created_at DESC", ())
            .await?;

        let mut books = Vec::new();

        while let Some(row) = rows.next().await? {
            books.push(Book {
                id: row.get::<String>(0)?,
                title: row.get::<String>(1)?,
                author: row.get::<String>(2)?,
                language: row.get::<String>(3)?,
            });
        }

        Ok(books)
    }

    pub async fn get_book_by_id(
        &self,
        db: &DatabaseManager,
        book_id: &str,
    ) -> Result<Option<Book>, Box<dyn std::error::Error>> {
        let conn = db.get_connection();
        
        let mut rows = conn
            .query(
                "SELECT id, title, author, language FROM books WHERE id = ?",
                (book_id,)
            )
            .await?;

        if let Some(row) = rows.next().await? {
            Ok(Some(Book {
                id: row.get::<String>(0)?,
                title: row.get::<String>(1)?,
                author: row.get::<String>(2)?,
                language: row.get::<String>(3)?,
            }))
        } else {
            Ok(None)
        }
    }
}