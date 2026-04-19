use database::DatabaseManager;
use types::{Books, FormatType, IBindingsEpubBook, IBookType};

use crate::init_epub_service;

pub struct FormatsService {}

impl FormatsService {
    pub fn new() -> FormatsService {
        FormatsService {}
    }

    pub async fn get_books(
        &self,
        db: &DatabaseManager,
    ) -> Result<Books, Box<dyn std::error::Error>> {
        let epub_service = init_epub_service();

        let epub = epub_service.get_books(db).await?;

        Ok(Books { epub })
    }

    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        book: IBookType,
    ) -> Result<(), Box<dyn std::error::Error>> {
        match book {
            IBookType::Epub(epub) => self.add_epub(db, epub).await?,
        }

        Ok(())
    }

    pub async fn add_epub(
        &self,
        db: &DatabaseManager,
        book: IBindingsEpubBook,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let epub_service = init_epub_service();
        epub_service.add_book(db, book).await?;

        Ok(())
    }

    pub async fn set_book_percentage_progress(
        &self,
        db: &DatabaseManager,
        id: String,
        percentage_progress: String,
        format: FormatType,
    ) -> Result<(), Box<dyn std::error::Error>> {
        match format {
            FormatType::Epub => {
                let books_service = init_epub_service();
                books_service
                    .set_book_percentage_progress(db, id, percentage_progress)
                    .await?;
            }
            _ => return Err(format!("unsupported format: {:?}", format).into()),
        }

        Ok(())
    }

    pub async fn set_book_progress(
        &self,
        db: &DatabaseManager,
        id: String,
        progress: Vec<String>,
        format: FormatType,
    ) -> Result<(), Box<dyn std::error::Error>> {
        match format {
            FormatType::Epub => {
                let books_service = init_epub_service();
                books_service.set_book_progress(db, id, progress).await?;
            }
            _ => return Err(format!("unsupported format: {:?}", format).into()),
        }

        Ok(())
    }

    pub async fn get_book_structure_by_id(
        &self,
        db: &DatabaseManager,
        id: String,
        format: FormatType,
    ) -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }
}
