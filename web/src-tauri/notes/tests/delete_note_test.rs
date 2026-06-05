use database::DatabaseManager;
use notes::init_notes_service;
use sqlx::test;
use types::IBindingsNote;

pub fn mock_note(note_id: &str, book_id: &str, page: &str) -> IBindingsNote {
    IBindingsNote {
        note_id: note_id.to_string(),
        book_id: book_id.to_string(),
        chapter: "Chapter 2".to_string(),
        color: "blue".to_string(),
        created_at: "1780510075459".to_string(),
        note: "pending note".to_string(),
        page: page.to_string(),
        text: "Lorem ipsum".to_string(),
        title: "Book title".to_string(),
        updated_at: "1780510075459".to_string(),
        value: "epubcfi(/6/12!/4/2/2[tagalog])".to_string(),
    }
}

#[test]
async fn delete_note() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note = mock_note("1", "123", "1");

    service.add_note(&db, note.clone()).await?;

    let notes = service
        .get_notes_by_book_id(&db, note.book_id.clone())
        .await?;

    assert_eq!(
        notes.len(),
        1,
        "Expected exactly 1 note to be returned before deletion"
    );

    service
        .delete_note(&db, note.book_id.clone(), note.note_id.clone())
        .await?;

    let notes_after = service
        .get_notes_by_book_id(&db, note.book_id.clone())
        .await?;

    assert!(
        notes_after.is_empty(),
        "Expected the notes vector to be empty after deletion"
    );

    Ok(())
}

#[test]
async fn delete_non_existent_note() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note = mock_note("1", "123", "1");

    let result = service
        .delete_note(&db, note.book_id.clone(), note.note_id.clone())
        .await;

    assert!(result.is_err(), "Note not found");

    Ok(())
}

#[test]
async fn delete_one_of_many_notes() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    service.add_note(&db, mock_note("1", "123", "88")).await?;
    service.add_note(&db, mock_note("2", "123", "99")).await?;
    service.add_note(&db, mock_note("3", "123", "100")).await?;

    service
        .delete_note(&db, "123".to_string(), "2".to_string())
        .await?;

    let notes = service.get_notes_by_book_id(&db, "123".to_string()).await?;

    assert_eq!(notes.len(), 2, "Expected 2 notes after deleting one");
    assert!(
        notes.iter().all(|n| n.note_id != "2"),
        "Deleted note must not be present"
    );

    Ok(())
}

#[test]
async fn delete_with_wrong_book_id() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note = mock_note("1", "123", "1");
    service.add_note(&db, note.clone()).await?;

    let result = service
        .delete_note(&db, "wrong-book".to_string(), "1".to_string())
        .await;

    assert!(
        result.is_err(),
        "Expected error when book_id does not match"
    );

    let notes = service.get_notes_by_book_id(&db, "123".to_string()).await?;
    assert_eq!(notes.len(), 1, "Note must still exist after failed delete");

    Ok(())
}
