use bookmarks::init_bookmarks_service;
use database::DatabaseManager;
use sqlx::test;
use types::FormatType;
use types::IBindingsBookmark;

pub fn mock_bookmark(book_id: &str) -> IBindingsBookmark {
    IBindingsBookmark {
        book_id: book_id.to_string(),
        cfi: "epubcfi(/6/12!/4/2/2[tagalog])".to_string(),
        chapter: "chapter 1".to_string(),
        created_at: "1780510075459".to_string(),
        format: FormatType::Epub,
        title: "mock bookmark".to_string(),
        updated_at: "1780510075459".to_string(),
    }
}

#[test]
async fn get_bookmarks_should_return_empty_list_by_default()
-> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let book_id = "1";

    let bookmarks = service
        .get_bookmarks_by_book_id(&db, book_id.to_string())
        .await?;

    assert_eq!(
        bookmarks.len(),
        0,
        "Expected exactly 0 bookmarks to be returned"
    );

    Ok(())
}

#[test]
async fn get_bookmarks_should_return_exactly_one_bookmark_after_insertion()
-> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_bookmarks_service();

    let book_id = "1";

    let bookmark = mock_bookmark(book_id);

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
