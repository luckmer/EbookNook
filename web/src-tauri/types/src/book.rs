use crate::Epub;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "book.ts")]
pub struct Books {
    pub epub: Vec<Epub>,
    // pub pdf: Vec<>,
    // pub mobi: Vec<>,
}
