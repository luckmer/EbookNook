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
async fn get_note_by_id() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note = mock_note("1", "123", "2");
    service.add_note(&db, note.clone()).await?;

    let note_after = service
        .get_note_by_id(&db, &note.book_id, &note.note_id)
        .await;

    assert!(note_after.is_ok(), "Note found");

    Ok(())
}

#[test]
async fn get_note_by_id_that_does_not_exist() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note = mock_note("1", "123", "2");

    let note_after = service
        .get_note_by_id(&db, &note.book_id, &note.note_id)
        .await;

    assert!(note_after.is_err(), "Note not found");

    Ok(())
}
