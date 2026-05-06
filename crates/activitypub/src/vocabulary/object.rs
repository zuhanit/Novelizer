use std::fmt::Debug;

use serde::{Deserialize, Serialize};

pub trait Object: Sized + Debug {
    fn id(&self) -> &str;
    fn kind(&self) -> &str;
}
