pub const ANNOTATIONS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS annotations_table (
    id TEXT PRIMARY KEY,
    annotations TEXT NOT NULL
);
"#;

pub const INSERT_ANNOTATIONS_BOOK: &str = r#"
INSERT INTO annotations_table (id, annotations)
VALUES (?, ?);
"#;

pub const UPDATE_ANNOTATIONS_BOOK: &str = r#"
UPDATE annotations_table SET annotations = ? WHERE id = ?
"#;

pub const UPDATE_ANNOTATIONS_TABLE: &str = r#"
UPDATE annotations_table SET label = ?, description = ? WHERE id = ?
"#;

pub const SELECT_ANNOTATION_ELEMENT: &str = r#"
SELECT id FROM annotations_table WHERE id = ?
"#;

pub const SELECT_ANNOTATIONS_BY_ID: &str = r#"
SELECT annotations FROM annotations_table WHERE id = ?;
"#;

pub const DELETE_ANNOTATION_TABLE: &str = r#"
DELETE FROM annotations_table WHERE id = ?;
"#;
