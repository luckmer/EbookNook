use database::{DELETE_TOC, DatabaseManager, GET_TOC, INSERT_TOC};
use sqlx::Row;
use std::error::Error;
use types::{IBindingsToc, IBindingsTocStructure};

pub struct TocService {}

impl TocService {
    pub fn new() -> Self {
        TocService {}
    }

    pub async fn get_tocs(
        &self,
        db: &DatabaseManager,
        id: &String,
    ) -> Result<IBindingsToc, Box<dyn Error>> {
        let conn = db.get_pool();
        let row = sqlx::query(GET_TOC).bind(id).fetch_optional(conn).await?;
        match row {
            Some(row) => {
                let toc_json: String = row.try_get("toc")?;

                let tocs: Vec<IBindingsTocStructure> =
                    serde_json::from_str(&toc_json).unwrap_or_default();

                Ok(IBindingsToc {
                    id: id.to_string(),
                    toc: tocs,
                })
            }
            None => Ok(IBindingsToc {
                id: id.to_string(),
                toc: vec![],
            }),
        }
    }

    pub async fn toc_exist(
        &self,
        db: &DatabaseManager,
        id: &str,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        let row = sqlx::query(GET_TOC).bind(id).fetch_optional(conn).await?;
        Ok(row.is_some())
    }

    pub async fn add_tocs(
        &self,
        db: &DatabaseManager,
        toc: &IBindingsToc,
    ) -> Result<(), Box<dyn Error>> {
        let exist = self.toc_exist(db, &toc.id).await?;

        if exist {
            return Err("toc exist".into());
        }

        let conn = db.get_pool();
        let toc_json = serde_json::to_string(&toc.toc)?;

        sqlx::query(INSERT_TOC)
            .bind(&toc.id)
            .bind(toc_json)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn delete_toc(&self, db: &DatabaseManager, id: &str) -> Result<(), Box<dyn Error>> {
        let exist = self.toc_exist(db, &id).await?;

        if !exist {
            return Err("toc not found".into());
        }

        let conn = db.get_pool();

        let result = sqlx::query(DELETE_TOC).bind(id).execute(conn).await?;

        if result.rows_affected() == 0 {
            return Err(format!("TOC with id '{}' not found", id).into());
        }

        Ok(())
    }
}
