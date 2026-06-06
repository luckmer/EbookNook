pub const SECTIONS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS sections_table (
    id TEXT PRIMARY KEY,
    sections TEXT NOT NULL
);
"#;

pub const GET_SECTION: &str = r#"
    SELECT sections
    FROM sections_table
    WHERE id = ?1
"#;

pub const DELETE_SECTION: &str = r#"
    DELETE FROM sections_table
    WHERE id = ?1
"#;

pub const INSERT_SECTION: &str = r#"
    INSERT INTO sections_table (id, sections)
    VALUES (?1, ?2)
"#;
