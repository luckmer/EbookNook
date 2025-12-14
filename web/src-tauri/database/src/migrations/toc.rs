pub const TOC_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS toc (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    chapter_id TEXT,
    label TEXT NOT NULL,
    position INTEGER NOT NULL,

    FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);
"#;
