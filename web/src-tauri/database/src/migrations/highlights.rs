pub const HIGHLIGHTS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS highlights_table (
    id TEXT PRIMARY KEY,
    highlights TEXT NOT NULL
);
"#;

pub const INSERT_HIGHLIGHTS_BOOK: &str = r#"
INSERT INTO highlights_table (id, highlights)
VALUES (?, ?);
"#;

pub const UPDATE_HIGHLIGHTS_BOOK: &str = r#"
UPDATE highlights_table SET highlights = ? WHERE id = ?
"#;

pub const UPDATE_HIGHLIGHTS_TABLE: &str = r#"
UPDATE highlights_table SET label = ?, description = ? WHERE id = ?
"#;

pub const SELECT_HIGHLIGHTS_ELEMENT: &str = r#"
SELECT id FROM highlights_table WHERE id = ?
"#;

pub const SELECT_HIGHLIGHTS_BY_ID: &str = r#"
SELECT highlights FROM highlights_table WHERE id = ?;
"#;

pub const DELETE_HIGHLIGHTS_TABLE: &str = r#"
DELETE FROM highlights_table WHERE id = ?;
"#;
