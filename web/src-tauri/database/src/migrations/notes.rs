pub const NOTES_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS notes_table (
    id TEXT PRIMARY KEY,
    notes TEXT NOT NULL
);
"#;

pub const INSERT_NOTES_BOOK: &str = r#"
INSERT INTO notes_table (id, notes)
VALUES (?, ?);
"#;

pub const UPDATE_NOTES_BOOK: &str = r#"
UPDATE notes_table SET notes = ? WHERE id = ?
"#;

pub const UPDATE_NOTES_TABLE: &str = r#"
UPDATE notes_table SET label = ?, description = ? WHERE id = ?
"#;

pub const SELECT_NOTES_ELEMENT: &str = r#"
SELECT id FROM notes_table WHERE id = ?
"#;

pub const SELECT_NOTES_BY_ID: &str = r#"
SELECT notes FROM notes_table WHERE id = ?;
"#;

pub const DELETE_NOTES_TABLE: &str = r#"
DELETE FROM notes_table WHERE id = ?;
"#;
