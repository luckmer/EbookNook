pub const METADATA_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS metadata_table (
    id          TEXT PRIMARY KEY,
    format      TEXT NOT NULL,
    title       TEXT NOT NULL,
    author      TEXT NOT NULL,
    cover       TEXT NOT NULL,
    language    TEXT NOT NULL,
    publisher   TEXT,
    published   TEXT,
    contributor TEXT,
    description TEXT,
    identifier  TEXT,
    modified    TEXT,
    rights      TEXT,
    subject     TEXT
);
"#;

pub const GET_METADATA: &str = r#"
    SELECT format, title, author, cover, language, publisher, published,
           contributor, description, identifier, modified, rights, subject
    FROM metadata_table
    WHERE id = ?1
"#;

pub const DELETE_METADATA: &str = r#"
    DELETE FROM metadata_table
    WHERE id = ?1
"#;

pub const INSERT_METADATA: &str = r#"
    INSERT INTO metadata_table
        (id, format, title, author, cover, language, publisher, published,
         contributor, description, identifier, modified, rights, subject)
    VALUES
        (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)
"#;

pub const UPDATE_METADATA: &str = r#"
    UPDATE metadata_table
    SET format = ?2, title = ?3, author = ?4, cover = ?5, language = ?6,
        publisher = ?7, published = ?8, contributor = ?9, description = ?10,
        identifier = ?11, modified = ?12, rights = ?13, subject = ?14
    WHERE id = ?1
"#;
