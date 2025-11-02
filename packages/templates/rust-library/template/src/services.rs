//! Service layer following architectural discipline principles

use crate::models::{{Name}}Model;
use crate::error::{Error, Result};

/// Service for managing {{name}} operations
pub struct {{Name}}Service {
    // Add service dependencies here
}

impl {{Name}}Service {
    /// Creates a new instance of {{Name}}Service
    pub fn new() -> Self {
        {{Name}}Service {}
    }

    /// Gets data by ID
    ///
    /// # Arguments
    ///
    /// * `id` - The unique identifier
    ///
    /// # Returns
    ///
    /// Returns a Result containing the model or an error
    pub async fn get_data(&self, id: u32) -> Result<{{Name}}Model> {
        if id == 0 {
            return Err(Error::InvalidInput("ID cannot be zero".to_string()));
        }

        // Core logic here
        Ok({{Name}}Model {
            id,
            name: format!("Item {}", id),
            description: Some("Description".to_string()),
            created_at: chrono::Utc::now(),
        })
    }

    /// Creates new data
    ///
    /// # Arguments
    ///
    /// * `name` - The name for the new item
    /// * `description` - Optional description
    ///
    /// # Returns
    ///
    /// Returns a Result containing the created model
    pub fn create_data(&mut self, name: String, description: Option<String>) -> Result<{{Name}}Model> {
        if name.is_empty() {
            return Err(Error::InvalidInput("Name cannot be empty".to_string()));
        }

        Ok({{Name}}Model {
            id: 1, // In real implementation, generate ID
            name,
            description,
            created_at: chrono::Utc::now(),
        })
    }
}

