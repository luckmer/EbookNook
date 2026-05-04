use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "format.ts")]
#[serde(rename_all = "UPPERCASE")]
pub enum FormatType {
    Epub,
    Pdf,
    Mobi,
    Fb2,
    Fbz,
    Zip,
    Cbz,
    Azw,
    Azw3,
}
