use database::{
    DELETE_BOOKMARK, DatabaseManager, INSERT_BOOKMARK, SELECT_BOOKMARK_BY_BOOK_CFI_ID,
    SELECT_BOOKMARKS, UPDATE_BOOKMARK,
};
use sqlx::types::chrono;
use std::error::Error;
use types::{FormatType, IBindingsBookmark};

pub struct BookmarksService {}

impl BookmarksService {
    pub fn new() -> Self {
        BookmarksService {}
    }

    pub fn parse_bookmark(
        &self,
        row: sqlx::sqlite::SqliteRow,
    ) -> Result<IBindingsBookmark, Box<dyn Error>> {
        use sqlx::Row;
        let cfi: String = row.try_get("cfi")?;
        let format: FormatType = serde_json::from_str(row.try_get("format")?)?;
        let created_at: String = row.try_get("created_at")?;
        let updated_at: String = row.try_get("updated_at")?;
        let book_id: String = row.try_get("book_id")?;
        let title: String = row.try_get("title")?;
        let chapter: String = row.try_get("chapter")?;

        Ok(IBindingsBookmark {
            book_id,
            title,
            chapter,
            cfi,
            format,
            created_at,
            updated_at,
        })
    }

    pub async fn bookmark_exist(
        &self,
        db: &DatabaseManager,
        book_id: &String,
        cfi: &String,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let bookmark_exist = sqlx::query(SELECT_BOOKMARK_BY_BOOK_CFI_ID)
            .bind(book_id)
            .bind(cfi)
            .fetch_one(conn)
            .await
            .is_ok();

        Ok(bookmark_exist)
    }

    pub async fn get_bookmarks_by_book_id(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<Vec<IBindingsBookmark>, Box<dyn Error>> {
        let conn = db.get_pool();

        let raw_bookmarks = sqlx::query(SELECT_BOOKMARKS)
            .bind(id)
            .fetch_all(conn)
            .await?;

        let mut bookmarks = Vec::new();

        for row in raw_bookmarks {
            let bookmark = self.parse_bookmark(row)?;
            bookmarks.push(bookmark);
        }

        Ok(bookmarks)
    }

    pub async fn add_bookmark_by_book_id(
        &self,
        db: &DatabaseManager,
        payload: IBindingsBookmark,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();

        let format = serde_json::to_string(&payload.format)?;
        sqlx::query(INSERT_BOOKMARK)
            .bind(payload.book_id)
            .bind(payload.cfi)
            .bind(format)
            .bind(payload.chapter)
            .bind(payload.title)
            .bind(payload.updated_at)
            .bind(payload.created_at)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn update_bookmark_by_book_id(
        &self,
        db: &DatabaseManager,
        payload: IBindingsBookmark,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();
        let updated_at = chrono::Utc::now().to_rfc3339();

        let bookmark_exist = self
            .bookmark_exist(db, &payload.book_id, &payload.cfi)
            .await?;

        if !bookmark_exist {
            return Err("Bookmark not found".into());
        }

        let result = sqlx::query(UPDATE_BOOKMARK)
            .bind(payload.title)
            .bind(updated_at)
            .bind(payload.book_id)
            .bind(payload.cfi)
            .execute(conn)
            .await?;

        if result.rows_affected() == 0 {
            return Err("failed to update bookmark title".into());
        }

        Ok(())
    }

    pub async fn get_bookmark_by_id(
        &self,
        db: &DatabaseManager,
        id: &String,
        cfi: &String,
    ) -> Result<IBindingsBookmark, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let note_exist = self.bookmark_exist(db, id, cfi).await?;

        if !note_exist {
            return Err("bookmark not found".into());
        }

        let raw_bookmark = sqlx::query(SELECT_BOOKMARK_BY_BOOK_CFI_ID)
            .bind(id)
            .bind(cfi)
            .fetch_one(conn)
            .await?;

        let note = self.parse_bookmark(raw_bookmark)?;

        Ok(note)
    }

    pub async fn delete_bookmark_by_book_id(
        &self,
        db: &DatabaseManager,
        id: String,
        cfi: String,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();

        let bookmark_exist = self.bookmark_exist(db, &id, &cfi).await?;

        if !bookmark_exist {
            return Err("Bookmark not found".into());
        }

        let result = sqlx::query(DELETE_BOOKMARK)
            .bind(id)
            .bind(cfi)
            .execute(conn)
            .await?;

        if result.rows_affected() == 0 {
            return Err("Bookmark not found or already deleted".into());
        }

        Ok(())
    }
}
