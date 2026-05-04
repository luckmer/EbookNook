pub const PDF_BOOKS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS pdf_books_table (
    id                  TEXT PRIMARY KEY NOT NULL,
    metadata            TEXT NOT NULL,
    percentage_progress TEXT NOT NULL,
    progress            TEXT NOT NULL,
    format              TEXT NOT NULL
);
"#;

pub const PDF_TOC_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS pdf_book_toc_table (
    id TEXT PRIMARY KEY,
    toc TEXT NOT NULL
);
"#;

pub const PDF_SECTIONS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS pdf_book_sections_table (
    id TEXT PRIMARY KEY,
    sections TEXT NOT NULL
);
"#;

pub const INSERT_PDF_BOOK_SECTIONS: &str = r#"
INSERT OR REPLACE INTO pdf_book_sections_table (id, sections) VALUES (?, ?);
"#;

pub const SELECT_PDF_BOOK_SECTION_BY_ID: &str = r#"
SELECT sections FROM pdf_book_sections_table WHERE id = ?;
"#;

pub const INSERT_PDF_BOOK: &str = r#"
INSERT OR REPLACE INTO pdf_books_table (id, metadata, percentage_progress, progress, format)
VALUES (?, ?, ?, ?, ?);
"#;

pub const UPDATE_PDF_BOOK_PROGRESS: &str = r#"
UPDATE pdf_books_table SET progress = ? WHERE id = ?;
"#;

pub const UPDATE_PDF_BOOK_PERCENTAGE_PROGRESS: &str = r#"
UPDATE pdf_books_table SET percentage_progress = ? WHERE id = ?;
"#;

pub const DELETE_PDF_TABLE: &str = r#"
DELETE FROM pdf_books_table WHERE id = ?;
"#;

pub const INSERT_PDF_BOOK_TOC: &str = r#"
INSERT OR REPLACE INTO pdf_book_toc_table (id, toc) VALUES (?, ?);
"#;

pub const SELECT_PDF_BOOK_TOC_BY_ID: &str = r#"
SELECT toc FROM pdf_book_toc_table WHERE id = ?;
"#;

pub const SELECT_PROGRESS_FROM_PDF: &str = r#"
SELECT progress FROM pdf_books_table WHERE id = ?
"#;
