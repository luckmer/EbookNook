pub const BOOKMARKS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS bookmarks_table (
    book_id             TEXT NOT NULL,
    cfi                 TEXT NOT NULL,
    format              TEXT NOT NULL,
    chapter             TEXT NOT NULL,
    title               TEXT NOT NULL,
    updated_at          TEXT NOT NULL,
    created_at          TEXT NOT NULL,
    PRIMARY KEY (book_id, cfi)
);
"#;

pub const SELECT_BOOKMARKS: &str = r#"
    SELECT book_id, cfi, format, chapter, title, updated_at, created_at
    FROM bookmarks_table
    WHERE book_id = ?1
    ORDER BY created_at DESC
"#;

pub const SELECT_BOOKMARK_BY_BOOK_CFI_ID: &str = r#"
    SELECT book_id, cfi, format, chapter, title, updated_at, created_at
    FROM bookmarks_table
    WHERE book_id = ? AND cfi = ?
"#;

pub const DELETE_BOOKMARK: &str = r#"
    DELETE FROM bookmarks_table
    WHERE book_id = ?1 AND cfi = ?2
"#;

pub const UPDATE_BOOKMARK: &str = r#"
   UPDATE bookmarks_table
   SET title = ?1, updated_at = ?2
   WHERE book_id = ?3 AND cfi = ?4
"#;

pub const INSERT_BOOKMARK: &str = r#"
   INSERT INTO bookmarks_table (book_id, cfi, format, chapter, title, updated_at, created_at)
   VALUES  (?1, ?2, ?3, ?4, ?5, ?6, ?7)
   ON CONFLICT(book_id, cfi) DO UPDATE SET
       format     = excluded.format,
       updated_at = excluded.updated_at
"#;
