use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "notes.ts")]
pub struct Note {
    pub id: String,
    pub label: String,
    pub description: String,
    #[serde(rename = "normStart")]
    #[ts(rename = "normStart")]
    pub norm_start: f64,
    #[serde(rename = "normEnd")]
    #[ts(rename = "normEnd")]
    pub norm_end: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "notes.ts")]
pub struct Notes(Vec<Note>);
