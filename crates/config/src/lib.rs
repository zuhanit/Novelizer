use serde::Deserialize;

pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[derive(Deserialize)]
pub struct Config {}

#[derive(Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
}
