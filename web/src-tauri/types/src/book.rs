use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{
    IBindingsEpubBook, IBindingsEpubBookStructure, IBindingsMobiBook, IBindingsMobiBookStructure,
};

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "book.ts", untagged)]
#[serde(untagged)]
pub enum IBookType {
    Epub(IBindingsEpubBook),
    Mobi(IBindingsMobiBook),
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "book.ts", untagged)]
#[serde(untagged)]
pub enum IBookStructure {
    Epub(IBindingsEpubBookStructure),
    Mobi(IBindingsMobiBookStructure),
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "book.ts")]
pub struct Books {
    #[serde(rename = "EPUB")]
    pub epub: Vec<IBindingsEpubBook>,
    #[serde(rename = "MOBI")]
    pub mobi: Vec<IBindingsMobiBook>,
}
