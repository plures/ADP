//! {{name}} - Rust library with architectural discipline
//!
//! This library demonstrates proper Rust module structure
//! following architectural discipline principles.

pub mod services;
pub mod models;
pub mod error;

pub use error::{Error, Result};
pub use models::{{Name}}Model;
pub use services::{{Name}}Service;

/// Library version
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

