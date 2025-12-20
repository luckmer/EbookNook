pub const EPUB_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS epub_table (
    id TEXT PRIMARY KEY,
    url TEXT,
    hash TEXT NOT NULL,
    root_file_path TEXT NOT NULL,
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
    progress TEXT NOT NULL,
    toc TEXT NOT NULL,
    chapters TEXT NOT NULL
);
"#;

pub const INSERT_EPUB_BOOK: &str = r#"
INSERT INTO epub_table (
    id, url, hash, root_file_path, format, title, source_title, author,
    book_group, group_id, group_name, tags, cover_image_url, created_at,
    updated_at, deleted_at, uploaded_at, downloaded_at, cover_downloaded_at,
    last_updated, primary_language, metadata, progress, toc, chapters
)
VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
);
"#;
