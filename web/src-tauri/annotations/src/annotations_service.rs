use database::{
    DELETE_ANNOTATION, DatabaseManager, INSERT_ANNOTATION, SELECT_ANNOTATION, UPDATE_ANNOTATION,
};
use sqlx::types::chrono;
use types::IBindingsAnnotation;

pub struct AnnotationsService {}

impl AnnotationsService {
    pub fn new() -> Self {
        AnnotationsService {}
    }

    pub fn parse_annotation(
        &self,
        row: sqlx::sqlite::SqliteRow,
    ) -> Result<IBindingsAnnotation, Box<dyn std::error::Error>> {
        use sqlx::Row;

        Ok(IBindingsAnnotation {
            annotation_id: row.try_get("annotation_id")?,
            text: row.try_get("text")?,
            value: row.try_get("value")?,
            book_id: row.try_get("book_id")?,
            note: row.try_get("note")?,
            page: row.try_get("page")?,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
        })
    }

    pub async fn add_annotation(
        &self,
        db: &DatabaseManager,
        annotation: IBindingsAnnotation,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let res = sqlx::query(INSERT_ANNOTATION)
            .bind(annotation.book_id)
            .bind(annotation.annotation_id)
            .bind(annotation.value)
            .bind(annotation.note)
            .bind(annotation.page)
            .bind(annotation.created_at)
            .bind(annotation.updated_at)
            .execute(conn)
            .await?;

        if res.rows_affected() == 0 {
            return Err("Failed to add annotation".into());
        }

        Ok(())
    }

    pub async fn get_annotations_by_book_id(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<Vec<IBindingsAnnotation>, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let raw_annotations = sqlx::query(SELECT_ANNOTATION)
            .bind(id)
            .fetch_all(conn)
            .await?;

        let mut annotations = Vec::new();

        for row in raw_annotations {
            let annotation = self.parse_annotation(row)?;
            annotations.push(annotation);
        }

        Ok(annotations)
    }

    pub async fn delete_annotation(
        &self,
        db: &DatabaseManager,
        id: String,
        annotation_id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let res = sqlx::query(DELETE_ANNOTATION)
            .bind(id)
            .bind(annotation_id)
            .execute(conn)
            .await?;

        if res.rows_affected() == 0 {
            return Err("Failed to delete annotation".into());
        }

        Ok(())
    }

    pub async fn update_annotation(
        &self,
        db: &DatabaseManager,
        annotation: IBindingsAnnotation,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let now = chrono::Utc::now().timestamp();

        let res = sqlx::query(UPDATE_ANNOTATION)
            .bind(annotation.page)
            .bind(annotation.value)
            .bind(annotation.text)
            .bind(now)
            .bind(annotation.book_id)
            .bind(annotation.annotation_id)
            .execute(conn)
            .await?;

        if res.rows_affected() == 0 {
            return Err("Failed to update annotation".into());
        }

        Ok(())
    }
}
