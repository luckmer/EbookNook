use database::DatabaseManager;
use library::TocService;
use sqlx::test;
use types::IBindingsToc;
use types::IBindingsTocStructure;

pub fn mock_toc(id: &str) -> IBindingsToc {
    let toc = IBindingsToc {
        id: id.to_string(),
        toc: vec![
            IBindingsTocStructure {
                label: "Chapter 1".to_string(),
                href: "chapter1.html".to_string(),
                subitems: vec![IBindingsTocStructure {
                    label: "Section 1.1".to_string(),
                    href: "chapter1.html#section1".to_string(),
                    subitems: vec![],
                }],
            },
            IBindingsTocStructure {
                label: "Chapter 2".to_string(),
                href: "chapter2.html".to_string(),
                subitems: vec![],
            },
        ],
    };

    toc
}

#[test]
async fn get_toc_should_return_empty_list_by_default() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = TocService::new();

    let state = service.get_tocs(&db, &"1".to_string()).await?;

    assert_eq!(state.toc.len(), 0, "Expected exactly 0 toc to be returned");

    assert_eq!(state.id, "1".to_string(), "Expect book id");

    Ok(())
}

#[test]
async fn get_bookmarks_should_return_exactly_one_bookmark_after_insertion()
-> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = TocService::new();

    let book_id = "2";

    let toc = mock_toc(book_id);

    service.add_tocs(&db, &toc).await?;

    let response = service.get_tocs(&db, &book_id.to_string()).await?;

    assert_eq!(
        response.toc.len(),
        2,
        "Expected exactly 2 tocs to be returned"
    );
    assert_eq!(response.id, "2".to_string(), "Expect book id");

    Ok(())
}

#[test]
async fn add_tocs_should_succeed() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = TocService::new();
    let toc = mock_toc("22");
    let result = service.add_tocs(&db, &toc).await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn add_stores_id() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = TocService::new();
    service.add_tocs(&db, &mock_toc("42")).await?;
    let response = service.get_tocs(&db, &"42".to_string()).await?;
    assert_eq!(response.id, "42", "Expect correct book id");
    Ok(())
}

#[test]
async fn add_fails_if_toc_already_exists() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = TocService::new();
    service.add_tocs(&db, &mock_toc("3")).await?;
    let result = service.add_tocs(&db, &mock_toc("3")).await;
    assert!(result.is_err(), "toc exist");
    Ok(())
}

#[test]
async fn delete_succeeds() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = TocService::new();
    service.add_tocs(&db, &mock_toc("1")).await?;
    let result = service.delete_toc(&db, "1").await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn delete_fails_if_toc_not_found() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = TocService::new();
    let result = service.delete_toc(&db, "999").await;
    assert!(result.is_err(), "Expect error if toc is not found");
    Ok(())
}
