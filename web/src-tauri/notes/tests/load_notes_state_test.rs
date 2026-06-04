use database::DatabaseManager;
use notes::init_notes_service;
use sqlx::test;

#[test]
async fn load_default_notes_state() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();

    let service = init_notes_service();

    let id = "1";

    let notes = service.get_notes_by_book_id(&db, id.to_string()).await?;

    assert_eq!(notes.len(), 0, "Expected exactly 0 notes to be returned");

    Ok(())
}
