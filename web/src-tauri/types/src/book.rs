use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{
    IBindingsEpubBook, IBindingsEpubBookStructure, IBindingsMobiBook, IBindingsMobiBookStructure,
    IBindingsPDFBook, IBindingsPDFBookStructure,
};

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "book.ts", untagged)]
#[serde(untagged)]
pub enum IBookType {
    Epub(IBindingsEpubBook),
    Mobi(IBindingsMobiBook),
    Pdf(IBindingsPDFBook),
}

#[derive(Serialize, Deserialize, TS)]
#[serde(tag = "format", content = "book")]
#[ts(export, export_to = "book.ts")]
pub enum IAddBookType {
    #[serde(rename = "EPUB")]
    Epub(IBindingsEpubBook),
    #[serde(rename = "MOBI")]
    Mobi(IBindingsMobiBook),
    #[serde(rename = "PDF")]
    Pdf(IBindingsPDFBook),
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "book.ts", untagged)]
#[serde(untagged)]
pub enum IBookStructure {
    Epub(IBindingsEpubBookStructure),
    Mobi(IBindingsMobiBookStructure),
    Pdf(IBindingsPDFBookStructure),
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "book.ts")]
pub struct Books {
    #[serde(rename = "EPUB")]
    pub epub: Vec<IBindingsEpubBook>,
    #[serde(rename = "MOBI")]
    pub mobi: Vec<IBindingsMobiBook>,
    #[serde(rename = "PDF")]
    pub pdf: Vec<IBindingsPDFBook>,
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
    #[serde(rename = "PDF")]
    Pdf(HashMap<IBindingsBookContent, String>),
}
