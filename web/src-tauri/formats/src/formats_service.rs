use database::DatabaseManager;
use types::{Books, Epub, EpubStructure};

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

        let epub_books = epub_service.get_books(db).await?;

        Ok(Books { epub: epub_books })
    }

    pub async fn add_epub_book(
        &self,
        db: &DatabaseManager,
        epub: Epub,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let epub_service = init_epub_service();

        epub_service.add_book(db, epub).await?;

        Ok(())
    }

    pub async fn get_epub_structure_by_id(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<EpubStructure, Box<dyn std::error::Error>> {
        let epub_service = init_epub_service();

        let epub_structure = epub_service.get_epub_structure_by_id(db, id).await?;

        Ok(epub_structure)
    }
}
