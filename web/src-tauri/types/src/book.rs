use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct ILanguageMap(pub HashMap<String, String>);

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct ILocation {
    pub current: i32,
    pub next: i32,
    pub total: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct Identifier {
    pub scheme: String,
    pub value: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct Contributor {
    pub name: ILanguageMap,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct ICollection {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub position: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct ISeries {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub position: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "book.ts")]
pub enum ITitle {
    Single(String),
    Localized(ILanguageMap),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "book.ts")]
pub enum IAuthor {
    Single(String),
    Contributor(Contributor),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "book.ts")]
pub enum ILanguage {
    Single(String),
    Multiple(Vec<String>),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "book.ts")]
pub enum ISubject {
    Single(String),
    Multiple(Vec<String>),
    Contributor(Contributor),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "book.ts")]
pub enum IAltIdentifier {
    Single(String),
    Multiple(Vec<String>),
    Identifier(Identifier),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "book.ts")]
pub enum ICollectionOrArray {
    Single(ICollection),
    Multiple(Vec<ICollection>),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(untagged)]
#[ts(export, export_to = "book.ts")]
pub enum ISeriesOrArray {
    Single(ISeries),
    Multiple(Vec<ISeries>),
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct IBelongsTo {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub collection: Option<ICollectionOrArray>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub series: Option<ISeriesOrArray>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "book.ts")]
pub struct BookMetadata {
    pub title: ITitle,
    pub author: IAuthor,
    pub cover: String,
    pub language: ILanguage,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub editor: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub publisher: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub published: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subject: Option<ISubject>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub identifier: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub isbn: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub alt_identifier: Option<IAltIdentifier>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub belongs_to: Option<IBelongsTo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subtitle: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub series: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub series_index: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub series_total: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub cover_image_file: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub cover_image_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub cover_image_blob_url: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct ITocItem {
    pub id: i32,
    pub label: String,
    pub href: String,
    pub index: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub cfi: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub location: Option<ILocation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subitems: Option<Vec<ITocItem>>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub enum PageSpread {
    #[serde(rename = "left")]
    Left,
    #[serde(rename = "right")]
    Right,
    #[serde(rename = "center")]
    Center,
    #[serde(rename = "")]
    Empty,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "book.ts")]
pub struct IBookDocSectionItem {
    pub id: String,
    pub cfi: String,
    pub size: f64,
    pub linear: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub href: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub location: Option<ILocation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub page_spread: Option<PageSpread>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub subitems: Option<Vec<IBookDocSectionItem>>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub enum RenditionLayout {
    #[serde(rename = "pre-paginated")]
    PrePaginated,
    #[serde(rename = "reflowable")]
    Reflowable,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub enum RenditionSpread {
    #[serde(rename = "auto")]
    Auto,
    #[serde(rename = "none")]
    None,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct Viewport {
    pub width: f64,
    pub height: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct Rendition {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub layout: Option<RenditionLayout>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub spread: Option<RenditionSpread>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub viewport: Option<Viewport>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
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

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct IBookFile {
    pub metadata: BookMetadata,
    pub rendition: Rendition,
    #[serde(rename = "percentageProgress")]
    #[ts(rename = "percentageProgress")]
    pub percentage_progress: String,
    pub progress: Vec<String>,
    pub format: FormatType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[ts(optional)]
    pub toc: Option<Vec<ITocItem>>,
    pub sections: Vec<IBookDocSectionItem>,
    pub id: String,
}
