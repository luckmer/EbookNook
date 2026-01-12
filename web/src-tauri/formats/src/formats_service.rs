use database::DatabaseManager;
use types::Books;

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
}
