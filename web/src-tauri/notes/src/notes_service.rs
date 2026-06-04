use database::{DELETE_NOTE, DatabaseManager, INSERT_NOTE, SELECT_NOTE, UPDATE_NOTE};
use sqlx::types::chrono;
use types::IBindingsNote;

pub struct NotesService {}

impl NotesService {
    pub fn new() -> Self {
        NotesService {}
    }

    pub fn parse_note(
        &self,
        row: sqlx::sqlite::SqliteRow,
    ) -> Result<IBindingsNote, Box<dyn std::error::Error>> {
        use sqlx::Row;

        Ok(IBindingsNote {
            note_id: row.try_get("note_id")?,
            text: row.try_get("text")?,
            value: row.try_get("value")?,
            book_id: row.try_get("book_id")?,
            note: row.try_get("note")?,
            page: row.try_get("page")?,
            chapter: row.try_get("chapter")?,
            color: row.try_get("color")?,
            title: row.try_get("title")?,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
        })
    }

    pub async fn add_note(
        &self,
        db: &DatabaseManager,
        note: IBindingsNote,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let res = sqlx::query(INSERT_NOTE)
            .bind(note.book_id)
            .bind(note.note_id)
            .bind(note.value)
            .bind(note.note)
            .bind(note.page)
            .bind(note.chapter)
            .bind(note.title)
            .bind(note.color)
            .bind(note.text)
            .bind(note.created_at)
            .bind(note.updated_at)
            .execute(conn)
            .await?;

        if res.rows_affected() == 0 {
            return Err("Failed to add note".into());
        }

        Ok(())
    }

    pub async fn get_notes_by_book_id(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<Vec<IBindingsNote>, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let raw_notes = sqlx::query(SELECT_NOTE).bind(id).fetch_all(conn).await?;

        let mut notes = Vec::new();

        for row in raw_notes {
            let note = self.parse_note(row)?;
            notes.push(note);
        }

        Ok(notes)
    }

    pub async fn delete_note(
        &self,
        db: &DatabaseManager,
        id: String,
        note_id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let res = sqlx::query(DELETE_NOTE)
            .bind(id)
            .bind(note_id)
            .execute(conn)
            .await?;

        if res.rows_affected() == 0 {
            return Err("Failed to delete note".into());
        }

        Ok(())
    }

    pub async fn update_note(
        &self,
        db: &DatabaseManager,
        note: IBindingsNote,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let now = chrono::Utc::now().timestamp();

        let res = sqlx::query(UPDATE_NOTE)
            .bind(note.title)
            .bind(now)
            .bind(note.book_id)
            .bind(note.note_id)
            .execute(conn)
            .await?;

        if res.rows_affected() == 0 {
            return Err("Failed to update note".into());
        }

        Ok(())
    }
}
