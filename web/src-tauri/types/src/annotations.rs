use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "annotations.ts")]
pub struct Annotation {
    pub id: String,
    pub label: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "annotations.ts")]
pub struct Annotations(Vec<Annotation>);
