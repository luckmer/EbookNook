use database::{
    DELETE_BOOKMARK, DatabaseManager, INSERT_BOOKMARK, SELECT_BOOKMARKS, UPDATE_BOOKMARK,
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

        Ok(IBindingsBookmark {
            book_id,
            cfi,
            format,
            created_at,
            updated_at,
        })
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
        let format = serde_json::to_string(&payload.format)?;
        let updated_at = chrono::Utc::now().to_rfc3339();

        sqlx::query(UPDATE_BOOKMARK)
            .bind(format)
            .bind(updated_at)
            .bind(payload.book_id)
            .bind(payload.cfi)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn delete_bookmark_by_book_id(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();
        sqlx::query(DELETE_BOOKMARK).bind(id).execute(conn).await?;

        Ok(())
    }
}
