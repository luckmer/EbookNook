use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS, Hash, Eq, PartialEq)]
#[ts(export, export_to = "progress.ts")]
#[serde(rename_all = "UPPERCASE")]
pub enum ProgressType {
    Cfi,
}
