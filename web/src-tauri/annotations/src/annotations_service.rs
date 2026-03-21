use database::{
    DatabaseManager, INSERT_HIGHLIGHTS_BOOK, INSERT_NOTES_BOOK, SELECT_HIGHLIGHTS_BY_ID,
    SELECT_NOTES_BY_ID, SELECT_NOTES_ELEMENT, UPDATE_HIGHLIGHTS_BOOK, UPDATE_NOTES_BOOK,
};

use types::{Highlight, Note};
pub struct AnnotationsService {}

impl AnnotationsService {
    pub fn new() -> Self {
        AnnotationsService {}
    }

    pub async fn insert(
        id: String,
        db: &DatabaseManager,
        json: String,
        query: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        sqlx::query(query)
            .bind(&id)
            .bind(&json)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn fetch_optional(
        db: &DatabaseManager,
        query: &str,
        id: &str,
    ) -> Result<Option<String>, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let result: Option<String> = sqlx::query_scalar(query)
            .bind(id)
            .fetch_optional(conn)
            .await?;

        Ok(result)
    }

    pub async fn edit_note() -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }

    pub async fn add_note(
        &self,
        db: &DatabaseManager,
        note: Note,
        id: String,
    ) -> Result<Note, Box<dyn std::error::Error>> {
        let mut notes = self.get_notes_by_id(db, id.clone()).await?;

        notes.push(note.clone());

        let json = serde_json::to_string(&notes)?;

        let content = Self::fetch_optional(db, SELECT_NOTES_ELEMENT, &id).await?;

        match content {
            Some(_) => Self::insert(json, db, id, UPDATE_NOTES_BOOK).await?,
            None => Self::insert(id, db, json, INSERT_NOTES_BOOK).await?,
        }

        Ok(note)
    }

    pub async fn get_notes_by_id(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<Vec<Note>, Box<dyn std::error::Error>> {
        let json = Self::fetch_optional(db, SELECT_NOTES_BY_ID, &id).await?;

        let notes: Vec<Note> = match json {
            Some(json) => serde_json::from_str(&json)?,
            None => vec![],
        };

        Ok(notes)
    }

    pub async fn delete_note(
        &self,
        db: &DatabaseManager,
        id: String,
        book_id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut notes = self.get_notes_by_id(db, book_id.clone()).await?;

        notes.retain(|a| a.id != id);
        let json = serde_json::to_string(&notes)?;
        Self::insert(json, db, book_id, UPDATE_NOTES_BOOK).await?;

        Ok(())
    }

    pub async fn edit_highlight() -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }

    pub async fn add_highlight(
        &self,
        db: &DatabaseManager,
        highlight: Highlight,
        id: String,
    ) -> Result<Highlight, Box<dyn std::error::Error>> {
        let mut highlights = self.get_highlights_by_id(db, id.clone()).await?;

        highlights.push(highlight.clone());

        let json = serde_json::to_string(&highlights)?;

        let content = Self::fetch_optional(db, SELECT_HIGHLIGHTS_BY_ID, &id).await?;

        match content {
            Some(_) => Self::insert(id, db, json, UPDATE_HIGHLIGHTS_BOOK).await?,
            None => Self::insert(id, db, json, INSERT_HIGHLIGHTS_BOOK).await?,
        }

        Ok(highlight)
    }

    pub async fn get_highlights_by_id(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<Vec<Highlight>, Box<dyn std::error::Error>> {
        let json = Self::fetch_optional(db, SELECT_HIGHLIGHTS_BY_ID, &id).await?;

        let highlights: Vec<Highlight> = match json {
            Some(json) => serde_json::from_str(&json)?,
            None => vec![],
        };

        Ok(highlights)
    }

    pub async fn delete_highlight(
        &self,
        db: &DatabaseManager,
        id: String,
        book_id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut highlights = self.get_highlights_by_id(db, book_id.clone()).await?;

        highlights.retain(|a| a.id != id);
        let json = serde_json::to_string(&highlights)?;
        Self::insert(json, db, book_id, UPDATE_HIGHLIGHTS_BOOK).await?;

        Ok(())
    }
}
