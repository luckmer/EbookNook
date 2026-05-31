use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "notes.ts")]
pub struct IBindingsNote {
    pub value: String,
    #[serde(rename = "bookId")]
    #[ts(rename = "bookId")]
    pub book_id: String,
    pub note: String,
    pub page: String,
    #[serde(rename = "noteId")]
    #[ts(rename = "noteId")]
    pub note_id: String,
    pub text: String,
    #[serde(rename = "createdAt")]
    #[ts(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    #[ts(rename = "updatedAt")]
    pub updated_at: String,
}
