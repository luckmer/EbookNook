// use annotations::AnnotationsService;
use bookmarks::BookmarksService;
use database::DatabaseManager;
use formats::FormatsService;

pub struct AppState {
    pub db: DatabaseManager,
    pub format_service: FormatsService,
    pub bookmarks_service: BookmarksService,
}
