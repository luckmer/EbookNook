use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "toc.ts")]
pub struct IBindingsTocStructure {
    pub label: String,
    pub href: String,
    pub subitems: Vec<IBindingsTocStructure>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "toc.ts")]
pub struct IBindingsToc {
    pub id: String,
    pub toc: Vec<IBindingsTocStructure>,
}
