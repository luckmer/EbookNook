pub const NOTES_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS notes_table (
    book_id             TEXT NOT NULL,
    note_id             TEXT NOT NULL,
    value               TEXT NOT NULL,
    note                TEXT NOT NULL,
    page                TEXT NOT NULL, 
    chapter             TEXT NOT NULL,
    title               TEXT NOT NULL, 
    color               TEXT NOT NULL,
    text                TEXT NOT NULL,
    created_at          TEXT NOT NULL,
    updated_at          TEXT NOT NULL,
    PRIMARY KEY (book_id,note_id)
);
"#;

pub const DELETE_NOTE: &str = r#"
    DELETE FROM notes_table
    WHERE book_id = ?1 AND note_id = ?2
"#;

pub const UPDATE_NOTE: &str = r#"
    UPDATE notes_table
    SET title = ?, updated_at = ?
    WHERE book_id = ? AND note_id = ?
"#;

pub const SELECT_NOTE_BY_BOOK_ID: &str = r#"
    SELECT book_id, note_id, value, note, page, chapter, title, color, text, created_at, updated_at
    FROM notes_table
    WHERE book_id = ?1
    ORDER BY created_at DESC
"#;

pub const SELECT_NOTE_BY_ID: &str = r#"
    SELECT book_id, note_id, value, note, page, chapter, title, color, text, created_at, updated_at
    FROM notes_table
    WHERE book_id = ?1 AND note_id = ?2
"#;

pub const INSERT_NOTE: &str = r#"
    INSERT INTO notes_table (book_id, note_id, value, note, page, chapter, title, color, text, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
"#;
