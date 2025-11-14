//! Error types following architectural discipline principles

use thiserror::Error;

/// Custom error type
#[derive(Error, Debug)]
pub enum Error {
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
}

/// Result type alias
pub type Result<T> = std::result::Result<T, Error>;









