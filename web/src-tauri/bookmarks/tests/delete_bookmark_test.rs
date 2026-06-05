use bookmarks::init_bookmarks_service;
use database::DatabaseManager;
use sqlx::test;
use types::FormatType;
use types::IBindingsBookmark;

pub fn mock_bookmark(book_id: &str, updated_at: String, cfi: String) -> IBindingsBookmark {
    IBindingsBookmark {
        book_id: book_id.to_string(),
        cfi,
        chapter: "chapter 1".to_string(),
        created_at: "1780510075459".to_string(),
        format: FormatType::Epub,
        title: "mock bookmark".to_string(),
        updated_at,
    }
}

#[test]
async fn delete_bookmark_should_remove_bookmark_from_list() -> Result<(), Box<dyn std::error::Error>>
{
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let book_id = "1";
    let bookmark_a = mock_bookmark(
        book_id,
        "1780510075459".to_string(),
        "epubcfi(/6/12!/4/2/2[tagalog])".to_string(),
    );
    let bookmark_b = mock_bookmark(
        book_id,
        "1780510075459".to_string(),
        "epubcfi(/6/12!/4/2/2[chapter])".to_string(),
    );

    service
        .add_bookmark_by_book_id(&db, bookmark_a.clone())
        .await?;
    service
        .add_bookmark_by_book_id(&db, bookmark_b.clone())
        .await?;

    let bookmarks = service
        .get_bookmarks_by_book_id(&db, book_id.to_string())
        .await?;

    assert_eq!(
        bookmarks.len(),
        2,
        "Expected exactly 2 bookmarks to be returned"
    );

    let result = service
        .delete_bookmark_by_book_id(&db, bookmark_b.book_id, bookmark_b.cfi)
        .await;

    assert!(result.is_ok(), "Should successfully remove bookmark_b");

    let bookmarks_after = service
        .get_bookmarks_by_book_id(&db, book_id.to_string())
        .await?;

    assert_eq!(
        bookmarks_after.len(),
        1,
        "Expected exactly 1 bookmark to remain in the list"
    );

    Ok(())
}

#[test]
async fn delete_bookmark_should_fail_when_book_id_does_not_match()
-> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let book_id = "1";
    let bookmark_a = mock_bookmark(
        book_id,
        "1780510075459".to_string(),
        "epubcfi(/6/12!/4/2/2[tagalog])".to_string(),
    );

    service
        .add_bookmark_by_book_id(&db, bookmark_a.clone())
        .await?;

    let bookmarks = service
        .get_bookmarks_by_book_id(&db, book_id.to_string())
        .await?;

    assert_eq!(
        bookmarks.len(),
        1,
        "Expected exactly 1 bookmark to be returned"
    );

    let result = service
        .delete_bookmark_by_book_id(
            &db,
            "2".to_string(),
            "epubcfi(/6/12!/4/2/2[tagalog])".to_string(),
        )
        .await;

    assert!(
        result.is_err(),
        "Expected error when trying to delete with a non-matching book_id"
    );

    let bookmarks_after = service
        .get_bookmarks_by_book_id(&db, book_id.to_string())
        .await?;

    assert_eq!(
        bookmarks_after.len(),
        1,
        "The original bookmark should remain untouched"
    );

    Ok(())
}

#[test]
async fn delete_bookmark_should_fail_when_bookmark_does_not_exist()
-> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let result = service
        .delete_bookmark_by_book_id(
            &db,
            "2".to_string(),
            "epubcfi(/6/12!/4/2/2[tagalog])".to_string(),
        )
        .await;

    assert!(
        result.is_err(),
        "Deleting a non-existent bookmark should return an error"
    );

    Ok(())
}
