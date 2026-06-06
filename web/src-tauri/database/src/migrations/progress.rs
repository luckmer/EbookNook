pub const PROGRESS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS progress_table (
    id                  TEXT PRIMARY KEY,
    percentage_progress TEXT NOT NULL,
    progress            TEXT NOT NULL
);
"#;

pub const GET_PROGRESS: &str = r#"
    SELECT percentage_progress, progress
    FROM progress_table
    WHERE id = ?1
"#;

pub const UPDATE_PROGRESS: &str = r#"
    UPDATE progress_table SET percentage_progress = ?1, progress = ?2
    WHERE id = ?3;
"#;

pub const DELETE_PROGRESS: &str = r#"
    DELETE FROM progress_table
    WHERE id = ?1
"#;

pub const INSERT_PROGRESS: &str = r#"
    INSERT INTO progress_table (id, percentage_progress, progress)
    VALUES (?1, ?2, ?3)
"#;
