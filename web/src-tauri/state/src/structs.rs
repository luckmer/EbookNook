use bookmarks::BookmarksService;
use database::DatabaseManager;
use library::LibraryCore;
use notes::NotesService;

pub struct AppState {
    pub db: DatabaseManager,
    pub library_core: LibraryCore,
    pub bookmarks_service: BookmarksService,
    pub notes_service: NotesService,
}
