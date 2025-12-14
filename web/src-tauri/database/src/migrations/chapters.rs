pub const CHAPTERS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    position INTEGER NOT NULL,

    FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE
);
"#;
