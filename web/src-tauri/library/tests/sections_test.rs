use database::DatabaseManager;
use library::SectionsService;
use sqlx::test;
use types::{IBindingsSection, IBindingsSectionStruct};

pub fn mock_section(id: &str) -> IBindingsSection {
    IBindingsSection {
        id: id.to_string(),
        sections: vec![
            IBindingsSectionStruct {
                id: "section-1".to_string(),
                size: "1024".to_string(),
            },
            IBindingsSectionStruct {
                id: "section-2".to_string(),
                size: "2048".to_string(),
            },
        ],
    }
}

#[test]
async fn get_sections_should_return_empty_list_by_default() -> Result<(), Box<dyn std::error::Error>>
{
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = SectionsService::new();
    let state = service.get_sections(&db, &"1".to_string()).await?;
    assert_eq!(
        state.sections.len(),
        0,
        "Expected exactly 0 sections to be returned"
    );
    assert_eq!(state.id, "1".to_string(), "Expect book id");
    Ok(())
}

#[test]
async fn get_sections_should_return_exactly_two_sections_after_insertion()
-> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = SectionsService::new();
    let book_id = "2";
    let section = mock_section(book_id);
    service.add_sections(&db, &section).await?;
    let response = service.get_sections(&db, &book_id.to_string()).await?;
    assert_eq!(
        response.sections.len(),
        2,
        "Expected exactly 2 sections to be returned"
    );
    assert_eq!(response.id, "2".to_string(), "Expect book id");
    Ok(())
}

#[test]
async fn add_sections_should_succeed() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = SectionsService::new();
    let result = service.add_sections(&db, &mock_section("22")).await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn add_stores_id() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = SectionsService::new();
    service.add_sections(&db, &mock_section("42")).await?;
    let response = service.get_sections(&db, &"42".to_string()).await?;
    assert_eq!(response.id, "42", "Expect correct book id");
    Ok(())
}

#[test]
async fn add_fails_if_section_already_exists() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = SectionsService::new();
    service.add_sections(&db, &mock_section("3")).await?;
    let result = service.add_sections(&db, &mock_section("3")).await;
    assert!(result.is_err(), "section exist");
    Ok(())
}

#[test]
async fn delete_succeeds() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = SectionsService::new();
    service.add_sections(&db, &mock_section("1")).await?;
    let result = service.delete_section(&db, &"1".to_string()).await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn delete_fails_if_section_not_found() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = SectionsService::new();
    let result = service.delete_section(&db, &"999".to_string()).await;
    assert!(result.is_err(), "Expect error if section is not found");
    Ok(())
}
