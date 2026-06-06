use database::{DELETE_SECTION, DatabaseManager, GET_SECTION, INSERT_SECTION};
use sqlx::Row;
use std::error::Error;
use types::{IBindingsSection, IBindingsSectionStruct};

pub struct SectionsService {}

impl SectionsService {
    pub fn new() -> Self {
        SectionsService {}
    }

    pub async fn section_exist(
        &self,
        db: &DatabaseManager,
        id: &str,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        let conn = db.get_pool();
        let row = sqlx::query(GET_SECTION)
            .bind(id)
            .fetch_optional(conn)
            .await?;

        Ok(row.is_some())
    }

    pub async fn add_sections(
        &self,
        db: &DatabaseManager,
        section: &IBindingsSection,
    ) -> Result<(), Box<dyn Error>> {
        let exist = self.section_exist(db, &section.id).await?;

        if exist {
            return Err("section exist".into());
        }

        let conn = db.get_pool();

        let section_json = serde_json::to_string(&section.sections)?;

        sqlx::query(INSERT_SECTION)
            .bind(&section.id)
            .bind(section_json)
            .execute(conn)
            .await?;

        Ok(())
    }

    pub async fn delete_section(
        &self,
        db: &DatabaseManager,
        id: &String,
    ) -> Result<(), Box<dyn Error>> {
        let exist = self.section_exist(db, &id).await?;

        if !exist {
            return Err("section not found".into());
        }

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
            Some(row) => {
                let section_json: String = row.try_get("sections")?;

                let sections: Vec<IBindingsSectionStruct> =
                    serde_json::from_str(&section_json).unwrap_or_default();

                Ok(IBindingsSection {
                    id: id.to_string(),
                    sections,
                })
            }
            None => Ok(IBindingsSection {
                id: id.to_string(),
                sections: vec![],
            }),
        }
    }
}
