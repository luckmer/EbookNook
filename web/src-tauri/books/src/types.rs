use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Metadata {
    pub identifier: Option<String>,
    pub title: String,
    pub author: String,
    pub language: Option<Vec<String>>,
    pub description: Option<String>,
    pub publisher: Option<String>,
    pub published: Option<String>,
    pub modified: Option<String>,
    pub subject: Option<Vec<String>>,
    pub rights: Option<String>,
    pub cover: Option<String>,
    pub series: Option<Series>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Series {
    pub name: String,
    pub position: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Chapter {
    pub id: String,
    pub href: String,
    pub index: i32,
    pub content: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Toc {
    pub id: String,
    pub href: String,
    pub label: String,
    pub parent: Option<String>,
    pub subitems: Vec<Toc>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Book {
    pub id: String,
    pub url: Option<String>,
    pub hash: String,
    #[serde(rename = "rootFilePath")]
    pub root_file_path: String,
    pub format: String,
    pub title: String,
    #[serde(rename = "sourceTitle")]
    pub source_title: Option<String>,
    pub author: String,
    pub group: Option<String>,
    #[serde(rename = "groupId")]
    pub group_id: Option<String>,
    #[serde(rename = "groupName")]
    pub group_name: Option<String>,
    pub tags: Option<Vec<String>>,
    #[serde(rename = "coverImageUrl")]
    pub cover_image_url: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: i64,
    #[serde(rename = "updatedAt")]
    pub updated_at: i64,
    #[serde(rename = "deletedAt")]
    pub deleted_at: Option<i64>,
    #[serde(rename = "uploadedAt")]
    pub uploaded_at: Option<i64>,
    #[serde(rename = "downloadedAt")]
    pub downloaded_at: Option<i64>,
    #[serde(rename = "coverDownloadedAt")]
    pub cover_downloaded_at: Option<i64>,
    #[serde(rename = "lastUpdated")]
    pub last_updated: Option<i64>,
    #[serde(rename = "primaryLanguage")]
    pub primary_language: Option<String>,
    pub metadata: Metadata,
    pub progress: Vec<String>,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Epub {
    pub book: Book,
    pub toc: Vec<Toc>,
    pub chapters: Vec<Chapter>,
}
