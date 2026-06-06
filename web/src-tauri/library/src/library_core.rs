use std::{collections::HashMap, error::Error};

use crate::{LibraryService, MetadataService, ProgressService, SectionsService, TocService};
use database::DatabaseManager;
use types::{
    IBindingsBook, IBindingsBookStructure, IBindingsProgress, IBindingsSection, IBindingsToc,
};

pub struct LibraryCore {
    progress_service: ProgressService,
    sections_service: SectionsService,
    toc_service: TocService,
    library_service: LibraryService,
    metadata_service: MetadataService,
}

impl LibraryCore {
    pub fn new() -> Self {
        LibraryCore {
            progress_service: ProgressService::new(),
            sections_service: SectionsService::new(),
            metadata_service: MetadataService::new(),
            library_service: LibraryService::new(),
            toc_service: TocService::new(),
        }
    }

    pub async fn get_books(
        &self,
        db: &DatabaseManager,
    ) -> Result<Vec<IBindingsBook>, Box<dyn Error>> {
        let mut books = self.library_service.get_books(db).await?;
        let mut books_state: Vec<IBindingsBook> = vec![];

        for book in &mut books {
            let metadata = self.metadata_service.get_metadata(db, &book.id).await?;
            let progress = self.progress_service.get_progress(db, &book.id).await?;
            let full_book = IBindingsBook {
                created_at: book.created_at.clone(),
                format: book.format.clone(),
                id: book.id.clone(),
                metadata,
                updated_at: book.updated_at.clone(),
                percentage_progress: progress.percentage_progress,
                progress: progress.progress,
                sections: IBindingsSection {
                    id: book.id.clone(),
                    sections: vec![],
                },
                toc: IBindingsToc {
                    id: book.id.clone(),
                    toc: vec![],
                },
            };
            books_state.push(full_book);
        }
        Ok(books_state)
    }

    pub async fn add_book(
        &self,
        db: &DatabaseManager,
        book: &IBindingsBook,
    ) -> Result<(), Box<dyn Error>> {
        self.library_service.add_book(db, &book).await?;
        self.toc_service.add_tocs(db, &book.toc).await?;
        self.progress_service
            .set_progress(db, &book.id, &book.progress, &book.percentage_progress)
            .await?;

        self.metadata_service
            .set_metadata(db, &book.metadata)
            .await?;

        self.sections_service.add_sections(db).await?;
        Ok(())
    }

    pub async fn delete_book(
        &self,
        db: &DatabaseManager,
        id: &String,
    ) -> Result<(), Box<dyn Error>> {
        self.library_service.delete_book(db, id).await?;
        self.toc_service.delete_toc(db, id).await?;
        self.progress_service.delete_progress(db, id).await?;
        self.sections_service.delete_section(db, id).await?;
        Ok(())
    }

    pub async fn update_book_metadata(self, db: &DatabaseManager) -> Result<(), Box<dyn Error>> {
        self.library_service.update_book_metadata(db).await?;
        Ok(())
    }

    pub async fn update_book_progress(
        &self,
        db: &DatabaseManager,
        progress: IBindingsProgress,
    ) -> Result<(), Box<dyn Error>> {
        self.progress_service.update_progress(db, progress).await?;
        Ok(())
    }

    pub async fn get_book_structure(
        &self,
        db: &DatabaseManager,
        id: &String,
    ) -> Result<IBindingsBookStructure, Box<dyn Error>> {
        let sections = self.sections_service.get_sections(db, id).await?;
        let toc = self.toc_service.get_tocs(db, id).await?;

        Ok(IBindingsBookStructure {
            toc,
            sections,
            id: id.to_string(),
        })
    }

    pub fn update_metadata() {}
}
