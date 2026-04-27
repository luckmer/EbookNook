use std::error::Error;

use database::DatabaseManager;
use types::{Books, FormatType, IBookMetadata, IBookStructure, IBookType};

use crate::{init_epub_service, init_mobi_service};

pub struct FormatsService {}

impl FormatsService {
    pub fn new() -> FormatsService {
        FormatsService {}
    }
    pub async fn get_books(&self, db: &DatabaseManager) -> Result<Books, Box<dyn Error>> {
        let mobi = init_mobi_service().get_books(db).await?;
        let epub = init_epub_service().get_books(db).await?;
        Ok(Books { epub, mobi })
    }

    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        book: IBookType,
    ) -> Result<(), Box<dyn Error>> {
        match book {
            IBookType::Epub(epub) => {
                let epub_service = init_epub_service();
                epub_service.add_book(db, epub).await?;
            }
            IBookType::Mobi(mobi) => {
                let mobi_service = init_mobi_service();
                mobi_service.add_book(db, mobi).await?;
            }
            _ => return Err(format!("unsupported book").into()),
        }

        Ok(())
    }

    pub async fn delete_book(
        &self,
        db: &DatabaseManager,
        id: String,
        format: FormatType,
    ) -> Result<(), Box<dyn Error>> {
        match format {
            FormatType::Epub => {
                let books_service = init_epub_service();
                books_service.delete_book(db, id).await?;
            }
            FormatType::Mobi => {
                let books_service = init_mobi_service();
                books_service.delete_book(db, id).await?;
            }
            _ => return Err(format!("unsupported format: {:?}", format).into()),
        }

        Ok(())
    }

    pub async fn update_book_metadata(
        &self,
        db: &DatabaseManager,
        id: String,
        request: IBookMetadata,
    ) -> Result<IBookType, Box<dyn Error>> {
        match request {
            IBookMetadata::Epub(data) => {
                let book = init_epub_service()
                    .update_book_metadata(db, id, data)
                    .await?;
                Ok(IBookType::Epub(book))
            }
            IBookMetadata::Mobi(data) => {
                let book = init_mobi_service()
                    .update_book_metadata(db, id, data)
                    .await?;
                Ok(IBookType::Mobi(book))
            }
        }
    }
    pub async fn set_book_percentage_progress(
        &self,
        db: &DatabaseManager,
        id: String,
        percentage_progress: String,
        format: FormatType,
    ) -> Result<(), Box<dyn Error>> {
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
    ) -> Result<(), Box<dyn Error>> {
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
    ) -> Result<IBookStructure, Box<dyn Error>> {
        match format {
            FormatType::Epub => {
                let books_service = init_epub_service();
                let structure = books_service.get_book_structure_by_id(db, &id).await?;
                Ok(IBookStructure::Epub(structure))
            }
            FormatType::Mobi => {
                let books_service = init_mobi_service();
                let structure = books_service.get_book_structure_by_id(db, &id).await?;
                Ok(IBookStructure::Mobi(structure))
            }
            _ => Err(format!("unsupported format: {:?}", format).into()),
        }
    }
}
