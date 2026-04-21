pub const EPUB_BOOKS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS epub_books_table (
    id                  TEXT PRIMARY KEY NOT NULL,
    metadata            TEXT NOT NULL,
    rendition           TEXT NOT NULL,
    percentage_progress TEXT NOT NULL,
    progress            TEXT NOT NULL,
    format              TEXT NOT NULL
);
"#;

pub const EPUB_TOC_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS epub_book_toc_table (
    id TEXT PRIMARY KEY,
    toc TEXT NOT NULL
);
"#;

pub const EPUB_SECTIONS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS epub_book_sections_table (
    id TEXT PRIMARY KEY,
    sections TEXT NOT NULL
);
"#;

pub const INSERT_EPUB_BOOK_SECTIONS: &str = r#"
INSERT OR REPLACE INTO epub_book_sections_table (id, sections) VALUES (?, ?);
"#;

pub const SELECT_EPUB_BOOK_SECTION_BY_ID: &str = r#"
SELECT sections FROM epub_book_sections_table WHERE id = ?;
"#;

pub const INSERT_EPUB_BOOK_TOC: &str = r#"
INSERT OR REPLACE INTO epub_book_toc_table (id, toc) VALUES (?, ?);
"#;

pub const SELECT_EPUB_BOOK_TOC_BY_ID: &str = r#"
SELECT toc FROM epub_book_toc_table WHERE id = ?;
"#;

pub const INSERT_EPUB_BOOK: &str = r#"
INSERT OR REPLACE INTO epub_books_table (id, metadata, rendition, percentage_progress, progress, format)
VALUES (?, ?, ?, ?, ?, ?);
"#;

pub const UPDATE_EPUB_BOOK_PROGRESS: &str = r#"
UPDATE epub_books_table SET progress = ?, updated_at = ? WHERE id = ?;
"#;

pub const UPDATE_EPUB_BOOK_PERCENTAGE_PROGRESS: &str = r#"
UPDATE epub_books_table SET percentage_progress = ?, updated_at = ? WHERE id = ?;
"#;

pub const DELETE_EPUB_TABLE: &str = r#"
DELETE FROM epub_books_table WHERE id = ?;
"#;
