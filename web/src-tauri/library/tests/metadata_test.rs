use database::DatabaseManager;
use library::MetadataService;
use sqlx::test;
use types::{FormatType, IBindingsMetadata, ILanguage};

pub fn mock_metadata(id: &str) -> IBindingsMetadata {
    IBindingsMetadata {
        id: id.to_string(),
        format: FormatType::Epub,
        title: "Test Book".to_string(),
        author: "Test Author".to_string(),
        cover: "cover.jpg".to_string(),
        language: ILanguage::Single("en".to_string()),
        publisher: Some("Test Publisher".to_string()),
        published: Some("2024-01-01".to_string()),
        contributor: Some("Test Contributor".to_string()),
        description: Some("Test Description".to_string()),
        identifier: Some("test-identifier".to_string()),
        modified: Some("2024-01-01".to_string()),
        rights: Some("Test Rights".to_string()),
        subject: Some("Test Subject".to_string()),
    }
}

#[test]
async fn get_fails_if_not_found() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = MetadataService::new();
    let result = service.get_metadata(&db, "999").await;
    assert!(result.is_err(), "Expect error if metada is not found");
    Ok(())
}

#[test]
async fn set_succeeds() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = MetadataService::new();
    let result = service.set_metadata(&db, &mock_metadata("1")).await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn set_stores_correct_values() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = MetadataService::new();
    service.set_metadata(&db, &mock_metadata("1")).await?;
    let response = service.get_metadata(&db, "1").await?;
    assert_eq!(response.id, "1".to_string());
    assert_eq!(response.title, "Test Book".to_string());
    assert_eq!(response.author, "Test Author".to_string());

    Ok(())
}

#[test]
async fn delete_succeeds() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = MetadataService::new();
    service.set_metadata(&db, &mock_metadata("1")).await?;
    let result = service.delete_metadata(&db, "1").await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn delete_fails_if_metadata_not_found() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = MetadataService::new();
    let result = service.delete_metadata(&db, "999").await;
    assert!(result.is_err(), "Expect error if metadata is not found");
    Ok(())
}

#[test]
async fn update_values() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = MetadataService::new();

    service.set_metadata(&db, &mock_metadata("1")).await?;

    let mut updated = mock_metadata("1");
    updated.title = "Updated Title".to_string();
    updated.author = "Updated Author".to_string();

    service.update_metadata(&db, updated).await?;

    let response = service.get_metadata(&db, "1").await?;

    assert_eq!(response.title, "Updated Title");
    assert_eq!(response.author, "Updated Author");

    Ok(())
}

#[test]
async fn update_fails_if_metadata_not_found() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = MetadataService::new();

    let result = service.update_metadata(&db, mock_metadata("999")).await;

    assert!(result.is_err(), "Expected error if metadata is not found");

    Ok(())
}
