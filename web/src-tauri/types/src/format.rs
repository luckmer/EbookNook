use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "format.ts")]
pub enum FormatType {
    #[serde(rename = "EPUB")]
    Epub,
    #[serde(rename = "PDF")]
    Pdf,
    #[serde(rename = "MOBI")]
    Mobi,
    #[serde(rename = "FB2")]
    Fb2,
    #[serde(rename = "FBZ")]
    Fbz,
    #[serde(rename = "ZIP")]
    Zip,
    #[serde(rename = "CBZ")]
    Cbz,
    #[serde(rename = "AZW")]
    Azw,
    #[serde(rename = "AZW3")]
    Azw3,
}
