pub const TOCS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS tocs_table (
    id TEXT PRIMARY KEY,
    toc TEXT NOT NULL
);
"#;

pub const GET_TOC: &str = r#"
    SELECT toc
    FROM tocs_table
    WHERE id = ?1
"#;

pub const DELETE_TOC: &str = r#"
    DELETE FROM tocs_table
    WHERE id = ?1
"#;

pub const INSERT_TOC: &str = r#"
    INSERT INTO tocs_table (id, toc)
    VALUES (?1, ?2)
"#;
