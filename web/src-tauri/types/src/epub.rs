use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct Metadata {
    #[ts(optional)]
    pub identifier: Option<String>,
    pub title: String,
    pub author: String,
    #[ts(optional)]
    pub language: Option<Vec<String>>,
    #[ts(optional)]
    pub description: Option<String>,
    #[ts(optional)]
    pub publisher: Option<String>,
    #[ts(optional)]
    pub published: Option<String>,
    #[ts(optional)]
    pub modified: Option<String>,
    #[ts(optional)]
    pub subject: Option<Vec<String>>,
    #[ts(optional)]
    pub rights: Option<String>,
    #[ts(optional)]
    pub cover: Option<String>,
    #[ts(optional)]
    #[serde(rename = "seriesName")]
    #[ts(rename = "seriesName")]
    pub series_name: Option<String>,
    #[ts(optional)]
    #[serde(rename = "seriesPosition")]
    #[ts(rename = "seriesPosition")]
    pub series_positions: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct Series {
    pub name: String,
    pub position: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct Chapter {
    pub id: String,
    pub href: String,
    pub index: i32,
    pub content: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct Toc {
    pub id: String,
    pub href: String,
    pub label: String,
    #[ts(optional)]
    pub parent: Option<String>,
    pub subitems: Vec<Toc>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct Book {
    pub id: String,
    #[ts(optional)]
    pub url: Option<String>,
    pub hash: String,
    #[serde(rename = "rootFilePath")]
    #[ts(rename = "rootFilePath")]
    pub root_file_path: String,
    pub format: String,
    pub title: String,
    #[serde(rename = "sourceTitle")]
    #[ts(rename = "sourceTitle")]
    #[ts(optional)]
    pub source_title: Option<String>,
    pub author: String,
    #[serde(rename = "groupId")]
    #[ts(rename = "groupId")]
    #[ts(optional)]
    pub group_id: Option<String>,
    #[serde(rename = "groupName")]
    #[ts(rename = "groupName")]
    #[ts(optional)]
    pub group_name: Option<String>,
    #[ts(optional)]
    pub tags: Option<Vec<String>>,
    #[serde(rename = "coverImageUrl")]
    #[ts(rename = "coverImageUrl")]
    #[ts(optional)]
    pub cover_image_url: Option<String>,
    #[serde(rename = "createdAt")]
    #[ts(rename = "createdAt")]
    pub created_at: i32,
    #[serde(rename = "updatedAt")]
    #[ts(rename = "updatedAt")]
    pub updated_at: i32,
    #[serde(rename = "deletedAt")]
    #[ts(rename = "deletedAt")]
    #[ts(optional)]
    pub deleted_at: Option<i32>,
    #[serde(rename = "uploadedAt")]
    #[ts(rename = "uploadedAt")]
    #[ts(optional)]
    pub uploaded_at: Option<i32>,
    #[serde(rename = "downloadedAt")]
    #[ts(rename = "downloadedAt")]
    #[ts(optional)]
    pub downloaded_at: Option<i32>,
    #[serde(rename = "coverDownloadedAt")]
    #[ts(rename = "coverDownloadedAt")]
    #[ts(optional)]
    pub cover_downloaded_at: Option<i32>,
    #[serde(rename = "lastUpdated")]
    #[ts(rename = "lastUpdated")]
    #[ts(optional)]
    pub last_updated: Option<i32>,
    #[serde(rename = "primaryLanguage")]
    #[ts(rename = "primaryLanguage")]
    #[ts(optional)]
    pub primary_language: Option<String>,
    pub metadata: Metadata,
    pub progress: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct Epub {
    pub book: Book,
    pub toc: Vec<Toc>,
    pub chapters: Vec<Chapter>,
}
