pub const ANNOTATIONS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS annotations_table (
    book_id             TEXT NOT NULL,
    annotation_id       TEXT NOT NULL,
    value               TEXT NOT NULL,
    note                TEXT NOT NULL,
    page                TEXT NOT NULL,  
    created_at          TEXT NOT NULL,
    updated_at          TEXT NOT NULL,
    PRIMARY KEY (book_id)
);
"#;

pub const DELETE_ANNOTATION: &str = r#"
    DELETE FROM annotations_table
    WHERE book_id = ?1 AND annotation_id = ?2
"#;

pub const UPDATE_ANNOTATION: &str = r#"
    UPDATE annotations_table
    SET page= ?, value = ?, text = ?, updated_at = ?
    WHERE book_id = ? AND annotation_id = ?
"#;

pub const SELECT_ANNOTATION: &str = r#"
    SELECT book_id, annotation_id, value, note, page, created_at, updated_at
    FROM annotations_table
    WHERE book_id = ?1
    ORDER BY created_at DESC
"#;

pub const INSERT_ANNOTATION: &str = r#"
    INSERT INTO annotations_table (book_id, annotation_id, value, note, page, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
"#;
