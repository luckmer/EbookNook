pub const BOOKS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS books_table (
    id                  TEXT NOT NULL,
    format              TEXT NOT NULL,
    updated_at          TEXT NOT NULL,
    created_at          TEXT NOT NULL,
    PRIMARY KEY (id, format)
);
"#;

pub const GET_BOOK: &str = r#"
    SELECT id, format, updated_at, created_at
    FROM books_table
    WHERE id = ?1
"#;

pub const GET_BOOKS: &str = r#"
    SELECT id, format, updated_at, created_at
    FROM books_table
"#;

pub const DELETE_BOOK: &str = r#"
    DELETE FROM books_table
    WHERE id = ?1
"#;

pub const INSERT_BOOK: &str = r#"
    INSERT OR REPLACE INTO books_table (id, format, updated_at, created_at)
    VALUES (?1, ?2, ?3, ?4)
"#;

pub const UPDATE_BOOK: &str = r#"
    UPDATE books_table
    SET format = ?2, updated_at = ?3
    WHERE id = ?1
"#;
