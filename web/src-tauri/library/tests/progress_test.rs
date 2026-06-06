use database::DatabaseManager;
use library::ProgressService;
use sqlx::test;
use std::collections::HashMap;
use types::{IBindingsProgress, ProgressType};

pub fn mock_progress(id: &str) -> IBindingsProgress {
    IBindingsProgress {
        id: id.to_string(),
        percentage_progress: "42.5".to_string(),
        progress: HashMap::from([(ProgressType::Cfi, "10".to_string())]),
    }
}

#[test]
async fn get_returns_empty_by_default() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = ProgressService::new();
    let state = service.get_progress(&db, &"1".to_string()).await?;
    assert_eq!(state.progress.len(), 0, "Expected empty progress map");
    assert_eq!(state.percentage_progress, "", "Expected empty percentage");
    assert_eq!(state.id, "1", "Expect book id to match");
    Ok(())
}

#[test]
async fn set_fails_if_already_exists() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = ProgressService::new();
    let p = mock_progress("1");
    service
        .set_progress(&db, &p.id, &p.progress, &p.percentage_progress)
        .await?;
    let result = service
        .set_progress(&db, &p.id, &p.progress, &p.percentage_progress)
        .await;
    assert!(result.is_err(), "Expect error if progress exist");
    Ok(())
}

#[test]
async fn set_stores_progress_map() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = ProgressService::new();
    let p = mock_progress("1");
    service
        .set_progress(&db, &p.id, &p.progress, &p.percentage_progress)
        .await?;
    let response = service.get_progress(&db, &"1".to_string()).await?;
    assert_eq!(
        response.progress.get(&ProgressType::Cfi),
        Some(&"10".to_string())
    );

    Ok(())
}

#[test]
async fn update_succeeds() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = ProgressService::new();
    let p = mock_progress("1");
    service
        .set_progress(&db, &p.id, &p.progress, &p.percentage_progress)
        .await?;
    let updated = IBindingsProgress {
        id: "1".to_string(),
        percentage_progress: "80.0".to_string(),
        progress: HashMap::from([(ProgressType::Cfi, "50".to_string())]),
    };
    let result = service.update_progress(&db, updated).await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn update_stores_new_values() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = ProgressService::new();
    let p = mock_progress("1");
    service
        .set_progress(&db, &p.id, &p.progress, &p.percentage_progress)
        .await?;
    let updated = IBindingsProgress {
        id: "1".to_string(),
        percentage_progress: "80.0".to_string(),
        progress: HashMap::from([(ProgressType::Cfi, "50".to_string())]),
    };
    service.update_progress(&db, updated).await?;
    let response = service.get_progress(&db, &"1".to_string()).await?;
    assert_eq!(response.percentage_progress, "80.0", "Expect success");
    assert_eq!(
        response.progress.get(&ProgressType::Cfi),
        Some(&"50".to_string())
    );

    Ok(())
}

#[test]
async fn update_fails_if_not_found() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = ProgressService::new();
    let result = service.update_progress(&db, mock_progress("999")).await;
    assert!(result.is_err(), "Expected error if progress is not found");
    Ok(())
}

#[test]
async fn delete_succeeds() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = ProgressService::new();
    let p = mock_progress("1");
    service
        .set_progress(&db, &p.id, &p.progress, &p.percentage_progress)
        .await?;
    let result = service.delete_progress(&db, &"1".to_string()).await;
    assert!(result.is_ok(), "Expect success");
    Ok(())
}

#[test]
async fn delete_fails_if_not_found() -> Result<(), Box<dyn std::error::Error>> {
    let db = DatabaseManager::new_from_url("sqlite::memory:")
        .await
        .unwrap();
    let service = ProgressService::new();
    let result = service.delete_progress(&db, &"999".to_string()).await;
    assert!(result.is_err(), "Expect error if progress is not found");
    Ok(())
}
