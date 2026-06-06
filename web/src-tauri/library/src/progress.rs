use database::{DELETE_PROGRESS, DatabaseManager, GET_PROGRESS, INSERT_PROGRESS, UPDATE_PROGRESS};
use sqlx::Row;
use std::{collections::HashMap, error::Error};
use types::{IBindingsProgress, ProgressType};

pub struct ProgressService {}

impl ProgressService {
    pub fn new() -> Self {
        ProgressService {}
    }

    pub async fn get_progress(
        &self,
        db: &DatabaseManager,
        id: &String,
    ) -> Result<IBindingsProgress, Box<dyn Error>> {
        let conn = db.get_pool();
        let row = sqlx::query(GET_PROGRESS)
            .bind(id)
            .fetch_optional(conn)
            .await?;

        match row {
            Some(row) => {
                let progress_json: String = row.try_get("progress")?;
                let progress: HashMap<ProgressType, String> = serde_json::from_str(&progress_json)?;

                Ok(IBindingsProgress {
                    id: id.to_string(),
                    percentage_progress: row.try_get("percentage_progress")?,
                    progress,
                })
            }
            None => Ok(IBindingsProgress {
                id: id.to_string(),
                percentage_progress: String::new(),
                progress: HashMap::new(),
            }),
        }
    }

    pub async fn delete_progress(
        &self,
        db: &DatabaseManager,
        id: &String,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();

        sqlx::query(DELETE_PROGRESS).bind(id).execute(conn).await?;

        Ok(())
    }

    pub async fn set_progress(
        &self,
        db: &DatabaseManager,
        id: &String,
        progress: &HashMap<ProgressType, String>,
        percentage_progress: &String,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();

        let progress_json = serde_json::to_string(&progress)?;

        sqlx::query(INSERT_PROGRESS)
            .bind(id)
            .bind(&percentage_progress)
            .bind(progress_json)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn update_progress(
        &self,
        db: &DatabaseManager,
        progress: IBindingsProgress,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();

        let progress_json = serde_json::to_string(&progress.progress)?;

        sqlx::query(UPDATE_PROGRESS)
            .bind(progress.percentage_progress)
            .bind(progress_json)
            .bind(progress.id)
            .execute(conn)
            .await?;

        Ok(())
    }
}
