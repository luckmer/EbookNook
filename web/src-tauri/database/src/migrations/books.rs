pub const BOOKS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    language TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
"#;
