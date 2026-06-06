use database::{DELETE_SECTION, DatabaseManager, GET_SECTION};
use std::error::Error;
use types::IBindingsSection;

pub struct SectionsService {}

impl SectionsService {
    pub fn new() -> Self {
        SectionsService {}
    }

    pub async fn add_sections(&self, db: &DatabaseManager) -> Result<(), Box<dyn Error>> {
        Ok(())
    }

    pub async fn delete_section(
        &self,
        db: &DatabaseManager,
        id: &String,
    ) -> Result<(), Box<dyn Error>> {
        let conn = db.get_pool();

        sqlx::query(DELETE_SECTION).bind(id).execute(conn).await?;

        Ok(())
    }

    pub async fn get_sections(
        &self,
        db: &DatabaseManager,
        id: &String,
    ) -> Result<IBindingsSection, Box<dyn Error>> {
        let conn = db.get_pool();
        let row = sqlx::query(GET_SECTION)
            .bind(&id)
            .fetch_optional(conn)
            .await?;

        match row {
            Some(row) => Ok(IBindingsSection {
                id: id.to_string(),
                sections: vec![],
            }),
            None => Ok(IBindingsSection {
                id: id.to_string(),
                sections: vec![],
            }),
        }
    }
}
