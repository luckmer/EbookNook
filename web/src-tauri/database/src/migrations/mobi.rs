pub const MOBI_BOOKS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS mobi_books_table (
    id                  TEXT PRIMARY KEY NOT NULL,
    metadata            TEXT NOT NULL,
    percentage_progress TEXT NOT NULL,
    progress            TEXT NOT NULL,
    format              TEXT NOT NULL
);
"#;

pub const INSERT_MOBI_BOOK: &str = r#"
INSERT OR REPLACE INTO mobi_books_table (id, metadata, percentage_progress, progress, format)
VALUES (?, ?, ?, ?, ?);
"#;

pub const MOBI_TOC_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS mobi_book_toc_table (
    id TEXT PRIMARY KEY,
    toc TEXT NOT NULL
);
"#;

pub const MOBI_SECTIONS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS mobi_book_sections_table (
    id TEXT PRIMARY KEY,
    sections TEXT NOT NULL
);
"#;

pub const INSERT_MOBI_BOOK_TOC: &str = r#"
INSERT OR REPLACE INTO mobi_book_toc_table (id, toc) VALUES (?, ?);
"#;

pub const INSERT_MOBI_BOOK_SECTIONS: &str = r#"
INSERT OR REPLACE INTO mobi_book_sections_table (id, sections) VALUES (?, ?);
"#;

pub const SELECT_MOBI_BOOK_SECTION_BY_ID: &str = r#"
SELECT sections FROM mobi_book_sections_table WHERE id = ?;
"#;

pub const SELECT_MOBI_BOOK_TOC_BY_ID: &str = r#"
SELECT toc FROM mobi_book_toc_table WHERE id = ?;
"#;
