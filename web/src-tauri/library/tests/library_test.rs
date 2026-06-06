use database::DatabaseManager;
use library::LibraryService;
use sqlx::test;
use types::{
    FormatType, IBindingsBook, IBindingsMetadata, IBindingsSection, IBindingsToc, ILanguage,
};

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

pub fn mock_book(id: &str) -> IBindingsBook {
    IBindingsBook {
        id: id.to_string(),
        format: FormatType::Epub,
        created_at: "2024-01-01".to_string(),
        updated_at: "2024-01-01".to_string(),
        metadata: mock_metadata(id),
        percentage_progress: "0".to_string(),
        progress: Default::default(),
        sections: IBindingsSection {
            id: id.to_string(),
            sections: vec![],
        },
        toc: IBindingsToc {
            id: id.to_string(),
            toc: vec![],
        },
    }
}

#[test]
async fn get_books_returns_empty_by_default() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = LibraryService::new();
    let result = service.get_books(&db).await?;
    assert_eq!(result.len(), 0, "Expect empty book list");
    Ok(())
}

#[test]
async fn add_book_succeeds() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = LibraryService::new();
    let result = service.add_book(&db, &mock_book("1")).await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn add_book_fails_if_already_exists() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = LibraryService::new();
    service.add_book(&db, &mock_book("1")).await?;
    let result = service.add_book(&db, &mock_book("1")).await;
    assert!(result.is_err(), "Expect error on duplicate.");
    Ok(())
}

#[test]
async fn get_books_returns_added_book() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = LibraryService::new();
    service.add_book(&db, &mock_book("1")).await?;
    let result = service.get_books(&db).await?;
    assert_eq!(result.len(), 1, "Expect 1 book");
    assert_eq!(result[0].id, "1");
    Ok(())
}

#[test]
async fn delete_book_succeeds() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = LibraryService::new();
    service.add_book(&db, &mock_book("1")).await?;
    let result = service.delete_book(&db, "1").await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn delete_book_fails_if_not_found() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = LibraryService::new();
    let result = service.delete_book(&db, "999").await;
    assert!(result.is_err(), "Expect error");
    Ok(())
}

#[test]
async fn delete_book_removes_it_from_list() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = LibraryService::new();
    service.add_book(&db, &mock_book("1")).await?;
    service.delete_book(&db, "1").await?;
    let result = service.get_books(&db).await?;
    assert_eq!(result.len(), 0, "Expect empty list after deletion");
    Ok(())
}
