use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::FormatType;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "metadata.ts")]
pub enum ILanguage {
    Single(String),
    Multiple(Vec<String>),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "metadata.ts")]
pub struct IBindingsMetadata {
    pub id: String,
    pub format: FormatType,
    pub title: String,
    pub author: String,
    pub cover: String,
    pub language: ILanguage,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub publisher: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub published: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub contributor: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub identifier: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub modified: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub rights: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subject: Option<String>,
}
