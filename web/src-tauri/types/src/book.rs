use std::collections::HashMap;

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

#[derive(Serialize, Deserialize, TS, Hash, Eq, PartialEq)]
#[ts(export, export_to = "book.ts")]
#[serde(rename_all = "lowercase")]
pub enum IBindingsBookContent {
    Author,
    Description,
    Published,
    Publisher,
    Title,
}

#[derive(Deserialize, TS)]
#[serde(tag = "format", content = "metadata")]
#[ts(export, export_to = "book.ts")]
pub enum IBookMetadata {
    #[serde(rename = "EPUB")]
    Epub(HashMap<IBindingsBookContent, String>),
    #[serde(rename = "MOBI")]
    Mobi(HashMap<IBindingsBookContent, String>),
}
