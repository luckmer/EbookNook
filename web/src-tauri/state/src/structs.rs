use bookmarks::BookmarksService;
use database::DatabaseManager;
use formats::FormatsService;
use notes::NotesService;

pub struct AppState {
    pub db: DatabaseManager,
    pub format_service: FormatsService,
    pub bookmarks_service: BookmarksService,
    pub notes_service: NotesService,
}
