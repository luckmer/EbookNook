use database::{DELETE_METADATA, DatabaseManager, GET_METADATA, INSERT_METADATA};
use sqlx::Row;
use std::error::Error;
use types::{FormatType, IBindingsMetadata, ILanguage};

pub struct MetadataService {}

impl MetadataService {
    pub fn new() -> Self {
        MetadataService {}
    }

    pub fn parse_metadata(
        &self,
        row: sqlx::sqlite::SqliteRow,
        id: &str,
    ) -> Result<IBindingsMetadata, Box<dyn std::error::Error>> {
        let language_json: String = row.try_get("language")?;
        let format_json: String = row.try_get("format")?;

        let format: FormatType = serde_json::from_str(&format_json)?;
        let language: ILanguage = serde_json::from_str(&language_json)?;

        Ok(IBindingsMetadata {
            id: id.to_string(),
            format,
            title: row.try_get("title")?,
            author: row.try_get("author")?,
            cover: row.try_get("cover")?,
            language,
            publisher: row.try_get("publisher")?,
            published: row.try_get("published")?,
            contributor: row.try_get("contributor")?,
            description: row.try_get("description")?,
            identifier: row.try_get("identifier")?,
            modified: row.try_get("modified")?,
            rights: row.try_get("rights")?,
            subject: row.try_get("subject")?,
        })
    }

    pub async fn get_metadata(
        &self,
        db: &DatabaseManager,
        id: &str,
    ) -> Result<IBindingsMetadata, Box<dyn Error>> {
        let conn = db.get_pool();
        let row = sqlx::query(GET_METADATA)
            .bind(id)
            .fetch_optional(conn)
            .await?;
        match row {
            Some(row) => Ok(self.parse_metadata(row, id)?),
            None => Err("Metadata not found".into()),
        }
    }

    pub async fn set_metadata(
        &self,
        db: &DatabaseManager,
        metadata: &IBindingsMetadata,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();

        let format = serde_json::to_string(&metadata.format)?;
        let language = serde_json::to_string(&metadata.language)?;

        sqlx::query(INSERT_METADATA)
            .bind(&metadata.id)
            .bind(format)
            .bind(&metadata.title)
            .bind(&metadata.author)
            .bind(&metadata.cover)
            .bind(language)
            .bind(&metadata.publisher)
            .bind(&metadata.published)
            .bind(&metadata.contributor)
            .bind(&metadata.description)
            .bind(&metadata.identifier)
            .bind(&metadata.modified)
            .bind(&metadata.rights)
            .bind(&metadata.subject)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn delete_metadata(
        &self,
        db: &DatabaseManager,
        id: &str,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();

        sqlx::query(DELETE_METADATA).bind(id).execute(conn).await?;

        Ok(())
    }
}
