use database::{
    DELETE_ANNOTATION_TABLE, DatabaseManager, INSERT_ANNOTATIONS_BOOK, SELECT_ANNOTATION_ELEMENT,
    SELECT_ANNOTATIONS_BY_ID, UPDATE_ANNOTATIONS_BOOK,
};

use types::Annotation;
pub struct AnnotationsService {}

impl AnnotationsService {
    pub fn new() -> Self {
        AnnotationsService {}
    }

    pub async fn add_annotation(
        &self,
        db: &DatabaseManager,
        annotation: Annotation,
        id: String,
    ) -> Result<Annotation, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let mut annotations = self.get_annotations_by_id(db, id.clone()).await?;

        annotations.push(annotation.clone());

        let json = serde_json::to_string(&annotations)?;

        let existing: Option<String> = sqlx::query_scalar(SELECT_ANNOTATION_ELEMENT)
            .bind(&id)
            .fetch_optional(conn)
            .await?;

        match existing {
            Some(_) => {
                sqlx::query(UPDATE_ANNOTATIONS_BOOK)
                    .bind(&json)
                    .bind(&id)
                    .execute(conn)
                    .await?;
            }
            None => {
                sqlx::query(INSERT_ANNOTATIONS_BOOK)
                    .bind(&id)
                    .bind(&json)
                    .execute(conn)
                    .await?;
            }
        }

        Ok(annotation)
    }

    pub async fn edit_annotation() -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }

    pub async fn delete_annotation(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }

    pub async fn get_annotations_by_id(
        &self,
        db: &DatabaseManager,
        id: String,
    ) -> Result<Vec<Annotation>, Box<dyn std::error::Error>> {
        let conn = db.get_pool();

        let toc_json: Option<String> = sqlx::query_scalar(SELECT_ANNOTATIONS_BY_ID)
            .bind(id)
            .fetch_optional(conn)
            .await?;

        let annotations: Vec<Annotation> = match toc_json {
            Some(json) => serde_json::from_str(&json)?,
            None => vec![],
        };

        Ok(annotations)
    }
}
