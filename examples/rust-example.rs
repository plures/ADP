// Rust Example - User Management Module
// This demonstrates a typical Rust module with functions

use std::collections::HashMap;
use std::fs::File;
use std::io::{self, Write};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: u32,
    pub name: String,
    pub email: String,
}

pub struct UserService {
    users: HashMap<u32, User>,
}

impl UserService {
    pub fn new() -> Self {
        UserService {
            users: HashMap::new(),
        }
    }

    pub fn create_user(&mut self, name: String, email: String) -> Result<User, String> {
        if name.is_empty() {
            return Err("Name cannot be empty".to_string());
        }

        if email.is_empty() {
            return Err("Email cannot be empty".to_string());
        }

        let id = self.users.len() as u32 + 1;
        let user = User {
            id,
            name: name.clone(),
            email: email.clone(),
        };

        self.users.insert(id, user.clone());
        Ok(user)
    }

    pub fn get_user(&self, id: u32) -> Option<&User> {
        self.users.get(&id)
    }

    pub fn find_users_by_name(&self, search_term: &str) -> Vec<&User> {
        self.users
            .values()
            .filter(|user| user.name.contains(search_term))
            .collect()
    }

    pub fn export_to_file(&self, file_path: &str) -> io::Result<()> {
        let json = serde_json::to_string_pretty(&self.users)?;
        let mut file = File::create(file_path)?;
        file.write_all(json.as_bytes())?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_user() {
        let mut service = UserService::new();
        let user = service.create_user(
            "John Doe".to_string(),
            "john@example.com".to_string()
        ).unwrap();
        
        assert_eq!(user.name, "John Doe");
    }

    #[test]
    fn test_get_user() {
        let mut service = UserService::new();
        let _ = service.create_user("Jane".to_string(), "jane@example.com".to_string());
        let user = service.get_user(1);
        
        assert!(user.is_some());
    }
}

