use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "sections.ts")]
pub struct IBindingsSection {
    pub id: String,
    pub sections: Vec<IBindingsSectionStruct>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "sections.ts")]
pub struct IBindingsSectionStruct {
    pub id: String,
    pub size: String,
}
