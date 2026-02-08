use std::collections::HashMap;

use database::DatabaseManager;
use types::{Books, Epub, EpubStructure, NewEpubBookContent, Progress};

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

    pub async fn set_epub_book_progress(
        &self,
        db: &DatabaseManager,
        id: String,
        progress: Progress,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let epub_service = init_epub_service();

        epub_service
            .set_epub_book_progress(db, id, progress)
            .await?;

        Ok(())
    }

    pub async fn delete_epub_book(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let epub_service = init_epub_service();

        epub_service.delete_epub_book(db, id).await?;

        Ok(())
    }

    pub async fn edit_epub_book(
        &self,
        db: &DatabaseManager,
        id: String,
        content: HashMap<NewEpubBookContent, String>,
    ) -> Result<Epub, Box<dyn std::error::Error>> {
        let epub_service = init_epub_service();

        let response = epub_service.edit_epub_book(db, id, content).await?;

        Ok(response)
    }
}
