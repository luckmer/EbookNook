pub const BOOKMARKS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS epub_bookmarks_table (
    book_id             TEXT NOT NULL,
    cfi                 TEXT NOT NULL,
    format              TEXT NOT NULL,
    updated_at          TEXT NOT NULL,
    created_at          TEXT NOT NULL,
    PRIMARY KEY (book_id, cfi)
);
"#;

pub const SELECT_BOOKMARKS: &str = r#"
    SELECT book_id, cfi, format, updated_at, created_at
    FROM epub_bookmarks_table
    WHERE book_id = ?1
    ORDER BY created_at DESC
"#;

pub const DELETE_BOOKMARK: &str = r#"
    DELETE FROM epub_bookmarks_table
    WHERE book_id = ?1 AND cfi = ?2
"#;

pub const UPDATE_BOOKMARK: &str = r#"
   UPDATE epub_bookmarks_table
   SET format = ?1, updated_at = ?2
   WHERE book_id = ?3 AND cfi = ?4
"#;

pub const INSERT_BOOKMARK: &str = r#"
   INSERT INTO epub_bookmarks_table (book_id, cfi, format, updated_at, created_at)
   VALUES (?1, ?2, ?3, ?4, ?4)
   ON CONFLICT(book_id, cfi) DO UPDATE SET
       format     = excluded.format,
       updated_at = excluded.updated_at
"#;
