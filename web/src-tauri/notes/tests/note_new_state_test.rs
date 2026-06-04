use database::DatabaseManager;
use notes::init_notes_service;
use sqlx::test;
use types::IBindingsNote;

pub fn mock_note(note_id: &str, book_id: &str, page: &str) -> IBindingsNote {
    IBindingsNote {
        note_id: note_id.to_string(),
        book_id: book_id.to_string(),
        chapter: "Chapter 1".to_string(),
        color: "red".to_string(),
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
async fn update_note() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note = mock_note("1", "123", "2");
    service.add_note(&db, note.clone()).await?;

    let notes = service
        .get_notes_by_book_id(&db, note.book_id.clone())
        .await?;

    assert_eq!(notes.len(), 1, "Expected exactly 1 note before update");

    let update_note = IBindingsNote {
        note_id: "1".to_string(),
        book_id: "123".to_string(),
        chapter: "Chapter 2".to_string(),
        color: "blue".to_string(),
        created_at: "1780510075459".to_string(),
        note: "pending note".to_string(),
        page: "2".to_string(),
        text: "Lorem ipsum".to_string(),
        title: "new title".to_string(),
        updated_at: "1780510075459".to_string(),
        value: "epubcfi(/6/12!/4/2/2[tagalog])".to_string(),
    };

    service.update_note(&db, update_note.clone()).await?;

    let note_after = service
        .get_note_by_id(&db, &update_note.book_id, &update_note.note_id)
        .await?;

    assert_eq!(
        note_after.title, update_note.title,
        "Title should reflect the update"
    );
    assert_eq!(
        note_after.note, update_note.note,
        "Note body should reflect the update"
    );

    Ok(())
}

#[test]
async fn update_note_not_found() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let ghost_note = IBindingsNote {
        note_id: "999".to_string(),
        book_id: "123".to_string(),
        chapter: "Chapter 1".to_string(),
        color: "red".to_string(),
        created_at: "1780510075459".to_string(),
        note: "does not exist".to_string(),
        page: "1".to_string(),
        text: "Lorem ipsum".to_string(),
        title: "Ghost".to_string(),
        updated_at: "1780510075459".to_string(),
        value: "epubcfi(/6/12!/4/2/2[tagalog])".to_string(),
    };

    let result = service.update_note(&db, ghost_note).await;
    assert!(result.is_err(), "Updating a non-existent note should fail");

    Ok(())
}

#[test]
async fn update_note_twice() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note = mock_note("1", "123", "1");
    service.add_note(&db, note.clone()).await?;

    let first_update = IBindingsNote {
        title: "First Update".to_string(),
        updated_at: "1780510075460".to_string(),
        ..note.clone()
    };

    service.update_note(&db, first_update).await?;

    let second_update = IBindingsNote {
        title: "Second Update".to_string(),
        updated_at: "1780510075999".to_string(),
        ..note.clone()
    };

    service.update_note(&db, second_update.clone()).await?;

    let note_after = service
        .get_note_by_id(&db, &note.book_id, &note.note_id)
        .await?;

    assert_eq!(
        note_after.title, "Second Update",
        "Should reflect the second update"
    );
    assert_eq!(
        note_after.updated_at, second_update.updated_at,
        "updated_at should be from second update"
    );

    Ok(())
}

#[test]
async fn update_note_with_same_data() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note = mock_note("1", "123", "1");
    service.add_note(&db, note.clone()).await?;

    let result = service.update_note(&db, note.clone()).await;
    assert!(
        result.is_ok(),
        "Updating with identical data should succeed"
    );

    let note_after = service
        .get_note_by_id(&db, &note.book_id, &note.note_id)
        .await?;

    assert_eq!(note_after.title, note.title, "Title should be unchanged");
    assert_eq!(note_after.note, note.note, "Note body should be unchanged");

    Ok(())
}
