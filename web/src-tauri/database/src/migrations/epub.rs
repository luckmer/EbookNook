pub const EPUB_BOOK_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS epub_table (
    id TEXT PRIMARY KEY,
    url TEXT,
    format TEXT NOT NULL,
    title TEXT NOT NULL,
    source_title TEXT,
    author TEXT NOT NULL,
    book_group TEXT,
    group_id TEXT,
    group_name TEXT,
    tags TEXT,
    cover_image_url TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    deleted_at INTEGER,
    uploaded_at INTEGER,
    downloaded_at INTEGER,
    cover_downloaded_at INTEGER,
    last_updated INTEGER,
    primary_language TEXT,
    metadata TEXT NOT NULL,
    progress TEXT NOT NULL
);
"#;

pub const INSERT_EPUB_BOOK: &str = r#"
INSERT INTO epub_table (
    id, url, format, title, source_title, author,
    group_id, group_name, tags, cover_image_url, created_at,
    updated_at, deleted_at, uploaded_at, downloaded_at, cover_downloaded_at,
    last_updated, primary_language, metadata, progress
)
VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
);
"#;

pub const EPUB_TOC_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS epub_toc_table (
    id TEXT PRIMARY KEY,
    toc TEXT NOT NULL
);
"#;

pub const UPDATE_EPUB_BOOK_PROGRESS: &str = r#"
UPDATE epub_table SET progress = ?, updated_at = ? WHERE id = ?
"#;

pub const INSERT_EPUB_TOC: &str = r#"
INSERT INTO epub_toc_table (id, toc) VALUES (?, ?);
"#;

pub const SELECT_EPUB_TOC_BY_ID: &str = r#"
SELECT toc FROM epub_toc_table WHERE id = ?;
"#;

pub const EPUB_CHAPTERS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS epub_chapters_table (
    id TEXT PRIMARY KEY,
    chapters TEXT NOT NULL
);
"#;

pub const INSERT_EPUB_CHAPTERS: &str = r#"
INSERT INTO epub_chapters_table (id, chapters) VALUES (?, ?);
"#;

pub const SELECT_EPUB_CHAPTERS_BY_ID: &str = r#"
SELECT chapters FROM epub_chapters_table WHERE id = ?;
"#;
