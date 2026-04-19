use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::FormatType;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct IBindingsEpubViewport {
    pub width: f64,
    pub height: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub enum IBindingsEpubSpread {
    #[serde(rename = "left")]
    Left,
    #[serde(rename = "right")]
    Right,
    #[serde(rename = "center")]
    Center,
    #[serde(rename = "")]
    Empty,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub enum IBindingsEpubLayout {
    #[serde(rename = "pre-paginated")]
    PrePaginated,
    #[serde(rename = "reflowable")]
    Reflowable,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "epub.ts")]
pub enum IEpubLanguage {
    Single(String),
    Multiple(Vec<String>),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct IBindingsEpubRendition {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub layout: Option<IBindingsEpubLayout>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub spread: Option<IBindingsEpubSpread>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub viewport: Option<IBindingsEpubViewport>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct IBindingsEpubToc {
    pub label: String,
    pub href: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subitems: Option<Vec<IBindingsEpubToc>>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct IBindingsEpubLocation {
    pub current: i32,
    pub next: i32,
    pub total: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "epub.ts")]
pub struct IBindingsEpubSection {
    pub id: String,
    pub cfi: String,
    pub size: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub linear: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub page_spread: Option<IBindingsEpubSpread>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "epub.ts")]
pub struct IBindingsEpubMetadata {
    pub title: String,
    pub author: String,
    pub cover: String,
    pub language: IEpubLanguage,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub editor: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub publisher: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub contributor: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub modified: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub rights: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub published: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subject: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub identifier: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub isbn: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subtitle: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub series: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub series_index: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub series_total: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct IBindingsEpubBook {
    pub metadata: IBindingsEpubMetadata,
    pub rendition: IBindingsEpubRendition,
    #[serde(rename = "percentageProgress")]
    #[ts(rename = "percentageProgress")]
    pub percentage_progress: String,
    pub progress: Vec<String>,
    pub format: FormatType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub toc: Option<Vec<IBindingsEpubToc>>,
    pub sections: Vec<IBindingsEpubSection>,
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "epub.ts")]
pub struct IBindingsEpubBookStructure {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub toc: Option<Vec<IBindingsEpubToc>>,
    pub sections: Vec<IBindingsEpubSection>,
    pub format: FormatType,
}
