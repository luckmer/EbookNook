use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{FormatType, ProgressType};

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "mobi.ts")]
pub enum IMobiLanguage {
    Single(String),
    Multiple(Vec<String>),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "mobi.ts")]
pub struct IBindingsMobiMetadata {
    pub title: String,
    pub author: String,
    pub cover: String,
    pub language: IMobiLanguage,
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

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "mobi.ts")]
pub struct IBindingsMobiToc {
    pub label: String,
    pub href: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subitems: Option<Vec<IBindingsMobiToc>>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "mobi.ts")]
pub struct IBindingsMobiSection {
    pub id: f64,
    pub size: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "mobi.ts")]
pub struct IBindingsMobiBook {
    pub metadata: IBindingsMobiMetadata,
    #[serde(rename = "percentageProgress")]
    #[ts(rename = "percentageProgress")]
    pub percentage_progress: String,
    pub progress: HashMap<ProgressType, String>,
    pub format: FormatType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub toc: Option<Vec<IBindingsMobiToc>>,
    pub sections: Vec<IBindingsMobiSection>,
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "mobi.ts")]
pub struct IBindingsMobiBookStructure {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub toc: Option<Vec<IBindingsMobiToc>>,
    pub sections: Vec<IBindingsMobiSection>,
    pub format: FormatType,
}
