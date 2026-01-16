use database::DatabaseManager;
use formats::FormatsService;

pub struct AppState {
    pub db: DatabaseManager,
    pub format_service: FormatsService,
}
