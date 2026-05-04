use std::{collections::HashMap, error::Error};

use database::DatabaseManager;
use types::{
    Books, FormatType, IAddBookType, IBookMetadata, IBookStructure, IBookType, ProgressType,
};

use crate::{
    EpubService, MobiService, PDFService, init_epub_service, init_mobi_service, init_pdf_service,
};

pub struct FormatsService {
    epub_service: EpubService,
    mobi_service: MobiService,
    pdf_service: PDFService,
}

impl FormatsService {
    pub fn new() -> FormatsService {
        FormatsService {
            epub_service: init_epub_service(),
            mobi_service: init_mobi_service(),
            pdf_service: init_pdf_service(),
        }
    }

    pub async fn get_books(&self, db: &DatabaseManager) -> Result<Books, Box<dyn Error>> {
        let mobi = self.mobi_service.get_books(db).await?;
        let epub = self.epub_service.get_books(db).await?;
        let pdf = self.pdf_service.get_books(db).await?;
        Ok(Books { epub, mobi, pdf })
    }

    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        book: IAddBookType,
    ) -> Result<(), Box<dyn Error>> {
        match book {
            IAddBookType::Epub(epub) => self.epub_service.add_book(db, epub).await?,
            IAddBookType::Mobi(mobi) => self.mobi_service.add_book(db, mobi).await?,
            IAddBookType::Pdf(pdf) => self.pdf_service.add_book(db, pdf).await?,
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
            FormatType::Epub => self.epub_service.delete_book(db, id).await?,
            FormatType::Mobi => self.mobi_service.delete_book(db, id).await?,
            FormatType::Pdf => self.pdf_service.delete_book(db, id).await?,
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
                let book = self.epub_service.update_book_metadata(db, id, data).await?;
                Ok(IBookType::Epub(book))
            }
            IBookMetadata::Mobi(data) => {
                let book = self.mobi_service.update_book_metadata(db, id, data).await?;
                Ok(IBookType::Mobi(book))
            }
            IBookMetadata::Pdf(data) => {
                let book = self.pdf_service.update_book_metadata(db, id, data).await?;
                Ok(IBookType::Pdf(book))
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
                self.epub_service
                    .set_book_percentage_progress(db, id, percentage_progress)
                    .await?
            }
            FormatType::Mobi => {
                self.mobi_service
                    .set_book_percentage_progress(db, id, percentage_progress)
                    .await?
            }
            FormatType::Pdf => {
                self.pdf_service
                    .set_book_percentage_progress(db, id, percentage_progress)
                    .await?
            }
            _ => return Err(format!("unsupported format: {:?}", format).into()),
        }
        Ok(())
    }

    pub async fn set_book_progress(
        &self,
        db: &DatabaseManager,
        id: String,
        progress: HashMap<ProgressType, String>,
        format: FormatType,
    ) -> Result<(), Box<dyn Error>> {
        match format {
            FormatType::Epub => {
                self.epub_service
                    .set_book_progress(db, id, progress)
                    .await?
            }
            FormatType::Mobi => {
                self.mobi_service
                    .set_book_progress(db, id, progress)
                    .await?
            }
            FormatType::Pdf => self.pdf_service.set_book_progress(db, id, progress).await?,
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
                let structure = self.epub_service.get_book_structure_by_id(db, &id).await?;
                Ok(IBookStructure::Epub(structure))
            }
            FormatType::Mobi => {
                let structure = self.mobi_service.get_book_structure_by_id(db, &id).await?;
                Ok(IBookStructure::Mobi(structure))
            }
            FormatType::Pdf => {
                let structure = self.pdf_service.get_book_structure_by_id(db, &id).await?;
                Ok(IBookStructure::Pdf(structure))
            }
            _ => Err(format!("unsupported format: {:?}", format).into()),
        }
    }
}
