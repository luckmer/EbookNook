use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::IBindingsEpubBook;

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "book.ts", untagged)]
#[serde(untagged)]
pub enum IBookType {
    Epub(IBindingsEpubBook),
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "book.ts")]
pub struct Books {
    #[serde(rename = "EPUB")]
    pub epub: Vec<IBindingsEpubBook>,
}
