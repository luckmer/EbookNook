use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::FormatType;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "pdf.ts")]
pub struct IBindingsPDFSection {
    pub id: f64,
    pub size: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "pdf.ts")]
pub struct IBindingsPDFToc {
    pub label: String,
    pub href: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subitems: Option<Vec<IBindingsPDFToc>>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "pdf.ts")]
pub struct IBindingsPDFMetadata {
    pub title: String,
    pub author: String,
    pub cover: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub publisher: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub contributor: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub published: Option<String>,
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
#[ts(export, export_to = "pdf.ts")]
pub struct IBindingsPDFBook {
    pub metadata: IBindingsPDFMetadata,
    #[serde(rename = "percentageProgress")]
    #[ts(rename = "percentageProgress")]
    pub percentage_progress: String,
    pub progress: HashMap<String, String>,
    pub format: FormatType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub toc: Option<Vec<IBindingsPDFToc>>,
    pub sections: Vec<IBindingsPDFSection>,
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "pdf.ts")]
pub struct IBindingsPDFBookStructure {
    pub sections: Vec<IBindingsPDFSection>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub toc: Option<Vec<IBindingsPDFToc>>,
    pub format: FormatType,
}
