use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::FormatType;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "bookmarks.ts")]
pub struct IBindingsBookmark {
    #[serde(rename = "bookId")]
    #[ts(rename = "bookId")]
    pub book_id: String,
    pub cfi: String,
    pub chapter: String,
    pub title: String,
    pub format: FormatType,
    #[serde(rename = "updatedAt")]
    #[ts(rename = "updatedAt")]
    pub updated_at: String,
    #[serde(rename = "createdAt")]
    #[ts(rename = "createdAt")]
    pub created_at: String,
}
