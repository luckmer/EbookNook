use bookmarks::init_bookmarks_service;
use database::DatabaseManager;
use sqlx::test;
use types::FormatType;
use types::IBindingsBookmark;

pub fn mock_bookmark(book_id: &str, updated_at: String) -> IBindingsBookmark {
    IBindingsBookmark {
        book_id: book_id.to_string(),
        cfi: "epubcfi(/6/12!/4/2/2[tagalog])".to_string(),
        chapter: "chapter 1".to_string(),
        created_at: "1780510075459".to_string(),
        format: FormatType::Epub,
        title: "mock bookmark".to_string(),
        updated_at,
    }
}

#[test]
async fn add_bookmark_should_save_exactly_one_bookmark() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let book_id = "1";
    let bookmark = mock_bookmark(book_id, "1780510075459".to_string());

    service.add_bookmark_by_book_id(&db, bookmark).await?;

    let bookmarks = service
        .get_bookmarks_by_book_id(&db, book_id.to_string())
        .await?;

    assert_eq!(
        bookmarks.len(),
        1,
        "Expected exactly 1 bookmark to be returned"
    );

    Ok(())
}

#[test]
async fn add_bookmark_should_upsert_on_conflict() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let book_id = "1";
    let bookmark = mock_bookmark(book_id, "1780510075459".to_string());
    let same_bookmark = mock_bookmark(book_id, "20000000".to_string());

    service.add_bookmark_by_book_id(&db, bookmark).await?;

    let result = service
        .add_bookmark_by_book_id(&db, same_bookmark.clone())
        .await;

    assert!(
        result.is_ok(),
        "Operation should succeed on database conflict"
    );

    let bookmarks = service
        .get_bookmarks_by_book_id(&db, book_id.to_string())
        .await?;

    assert_eq!(
        bookmarks.len(),
        1,
        "Expected exactly 1 bookmark to exist after conflict resolution"
    );

    let bookmark_after = service
        .get_bookmark_by_id(&db, &same_bookmark.book_id, &same_bookmark.cfi)
        .await?;

    assert_eq!(
        bookmark_after.updated_at, same_bookmark.updated_at,
        "The bookmark's updated_at field should be modified on conflict"
    );

    Ok(())
}

#[test]
async fn bookmarks_should_be_isolated_between_different_books()
-> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let bookmark_a = mock_bookmark("1", "1780510075459".to_string());
    let bookmark_b = mock_bookmark("2", "1780510075459".to_string());

    service.add_bookmark_by_book_id(&db, bookmark_a).await?;
    service.add_bookmark_by_book_id(&db, bookmark_b).await?;

    let bookmarks_a = service
        .get_bookmarks_by_book_id(&db, "1".to_string())
        .await?;

    assert_eq!(
        bookmarks_a.len(),
        1,
        "Book 1 should have exactly 1 bookmark"
    );
    assert_eq!(bookmarks_a[0].book_id, "1");

    let bookmarks_b = service
        .get_bookmarks_by_book_id(&db, "2".to_string())
        .await?;

    assert_eq!(
        bookmarks_b.len(),
        1,
        "Book 2 should have exactly 1 bookmark"
    );
    assert_eq!(bookmarks_b[0].book_id, "2");

    Ok(())
}
