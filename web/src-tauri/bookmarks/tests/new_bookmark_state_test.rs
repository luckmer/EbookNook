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
async fn update_bookmark_should_modify_existing_bookmark() -> Result<(), Box<dyn std::error::Error>>
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

    let updated_bookmark = IBindingsBookmark {
        book_id: book_id.to_string(),
        cfi: "epubcfi(/6/12!/4/2/2[chapter])".to_string(),
        chapter: "chapter 1".to_string(),
        created_at: "1780510075459".to_string(),
        format: FormatType::Epub,
        title: "New mock bookmark title".to_string(),
        updated_at: "1780510075459".to_string(),
    };

    let result = service
        .update_bookmark_by_book_id(&db, updated_bookmark.clone())
        .await;

    assert!(result.is_ok(), "Expected update operation to succeed");

    let bookmark_after = service
        .get_bookmark_by_id(&db, &updated_bookmark.book_id, &updated_bookmark.cfi)
        .await?;

    assert_eq!(
        bookmark_after.title, updated_bookmark.title,
        "Bookmark title should reflect the update"
    );

    Ok(())
}

#[test]
async fn update_bookmark_should_fail_when_bookmark_does_not_exist()
-> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let book_id = "1";

    let updated_bookmark = IBindingsBookmark {
        book_id: book_id.to_string(),
        cfi: "epubcfi(/6/12!/4/2/2[chapter])".to_string(),
        chapter: "chapter 1".to_string(),
        created_at: "1780510075459".to_string(),
        format: FormatType::Epub,
        title: "New mock bookmark title".to_string(),
        updated_at: "1780510075459".to_string(),
    };

    let result = service
        .update_bookmark_by_book_id(&db, updated_bookmark.clone())
        .await;

    assert!(
        result.is_err(),
        "Updating a non-existent bookmark should fail"
    );

    Ok(())
}

#[test]
async fn update_bookmark_with_same_data_should_succeed() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let book_id = "1";

    let bookmark = IBindingsBookmark {
        book_id: book_id.to_string(),
        cfi: "epubcfi(/6/12!/4/2/2[chapter])".to_string(),
        chapter: "chapter 1".to_string(),
        created_at: "1780510075459".to_string(),
        format: FormatType::Epub,
        title: "New mock bookmark title".to_string(),
        updated_at: "1780510075459".to_string(),
    };

    service
        .add_bookmark_by_book_id(&db, bookmark.clone())
        .await?;

    let result = service
        .update_bookmark_by_book_id(&db, bookmark.clone())
        .await;

    assert!(
        result.is_ok(),
        "Updating with identical data should succeed"
    );

    let bookmark_after = service
        .get_bookmark_by_id(&db, &bookmark.book_id, &bookmark.cfi)
        .await?;

    assert_eq!(
        bookmark_after.title, bookmark.title,
        "Bookmark title should remain unchanged"
    );

    Ok(())
}
