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
async fn add_notes() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_notes_service();

    let note = mock_note("1", "123", "1");

    service.add_note(&db, note.clone()).await?;

    let notes = service
        .get_notes_by_book_id(&db, note.book_id.clone())
        .await?;

    assert_eq!(notes.len(), 1, "Expected exactly 1 notes to be returned");

    Ok(())
}

#[test]
async fn notes_expect_unique_note() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_notes_service();
    let note = mock_note("1", "123", "1");

    service.add_note(&db, note.clone()).await?;
    let result = service.add_note(&db, note).await;

    assert!(
        result.is_err(),
        "Expected a unique constraint error on duplicate insert"
    );

    let notes = service.get_notes_by_book_id(&db, "123".to_string()).await?;
    assert_eq!(notes.len(), 1, "Expected exactly 1 note to be returned");

    Ok(())
}

#[test]
async fn notes_with_empty_text_or_note_fields_are_allowed() -> Result<(), Box<dyn std::error::Error>>
{
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note = IBindingsNote {
            note_id: "1780510075459".to_string(),
            book_id: "123".to_string(),
            chapter: "Chapter 1".to_string(),
            color: "red".to_string(),
            created_at: "1780510075459".to_string(),
            note: "".to_string(),
            page: "1".to_string(),
            text: "".to_string(),
            title: "Book title".to_string(),
            updated_at: "1780510075459".to_string(),
            value: "epubcfi(/6/12!/4/2/2[tagalog],/2[rw-title-block_43539-077535482],/42[rw-p_43542-151052214]/1:283)".to_string(),

        };

    let result = service.add_note(&db, note).await;
    assert!(
        result.is_ok(),
        "Service should handle empty text strings gracefully"
    );

    let notes = service.get_notes_by_book_id(&db, "123".to_string()).await?;
    assert_eq!(notes[0].note, "");
    assert_eq!(notes[0].text, "");
    Ok(())
}

#[test]
async fn notes_are_isolated_between_different_books() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = init_notes_service();

    let note_a = mock_note("1", "book_a", "1");
    let note_b = mock_note("1", "book_b", "1");

    service.add_note(&db, note_a).await?;
    service.add_note(&db, note_b).await?;

    let notes_a = service
        .get_notes_by_book_id(&db, "book_a".to_string())
        .await?;

    assert_eq!(notes_a.len(), 1);
    assert_eq!(notes_a[0].book_id, "book_a");

    let notes_b = service
        .get_notes_by_book_id(&db, "book_b".to_string())
        .await?;

    assert_eq!(notes_b.len(), 1);
    assert_eq!(notes_b[0].book_id, "book_b");
    Ok(())
}
