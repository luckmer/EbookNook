use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{FormatType, IBindingsMetadata, IBindingsSection, IBindingsToc, ProgressType};

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct IBindingsBook {
    pub metadata: IBindingsMetadata,
    #[serde(rename = "createdAt")]
    #[ts(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    #[ts(rename = "updatedAt")]
    pub updated_at: String,
    #[serde(rename = "percentageProgress")]
    #[ts(rename = "percentageProgress")]
    pub percentage_progress: String,
    pub progress: HashMap<ProgressType, String>,
    pub format: FormatType,
    pub toc: IBindingsToc,
    pub sections: IBindingsSection,
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct IBindingsRawBook {
    #[serde(rename = "createdAt")]
    #[ts(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    #[ts(rename = "updatedAt")]
    pub updated_at: String,
    pub format: FormatType,
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct IBindingsBookStructure {
    pub toc: IBindingsToc,
    pub sections: IBindingsSection,
    pub id: String,
}

#[derive(Serialize, Deserialize, TS, Hash, Eq, PartialEq)]
#[ts(export, export_to = "book.ts")]
#[serde(rename_all = "lowercase")]
pub enum IBindingsBookContent {
    Author,
    Description,
    Published,
    Publisher,
    Title,
}
