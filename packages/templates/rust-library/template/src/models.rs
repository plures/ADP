//! Data models following architectural discipline principles

use serde::{Deserialize, Serialize};

/// Model representing a {{name}} entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct {{Name}}Model {
    /// Unique identifier
    pub id: u32,
    
    /// Name of the item
    pub name: String,
    
    /// Optional description
    pub description: Option<String>,
    
    /// Creation timestamp
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl {{Name}}Model {
    /// Creates a new model instance
    pub fn new(id: u32, name: String) -> Self {
        Self {
            id,
            name,
            description: None,
            created_at: chrono::Utc::now(),
        }
    }
}

