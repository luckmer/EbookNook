use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS, Hash, Eq, PartialEq)]
#[ts(export, export_to = "progress.ts")]
#[serde(rename_all = "UPPERCASE")]
pub enum ProgressType {
    Cfi,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "progress.ts")]
pub struct IBindingsProgress {
    pub id: String,
    #[serde(rename = "percentageProgress")]
    #[ts(rename = "percentageProgress")]
    pub percentage_progress: String,
    pub progress: HashMap<ProgressType, String>,
}
