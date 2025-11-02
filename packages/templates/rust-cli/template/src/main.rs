//! {{name}} - CLI application with architectural discipline
//!
//! This CLI demonstrates proper Rust application structure
//! following architectural discipline principles.

use clap::{Parser, Subcommand};
use std::path::PathBuf;

mod commands;
mod error;

use error::{Error, Result};

#[derive(Parser)]
#[command(name = "{{name}}")]
#[command(about = "CLI application with architectural discipline", version = "1.0.0")]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    /// Verbose output
    #[arg(short, long)]
    verbose: bool,
}

#[derive(Subcommand)]
enum Commands {
    /// Process a file or directory
    Process {
        /// Target path
        #[arg(value_name = "PATH")]
        path: PathBuf,
    },
    /// Validate configuration
    Validate {
        /// Configuration file path
        #[arg(short, long, value_name = "FILE")]
        config: PathBuf,
    },
    /// Generate a report
    Report {
        /// Output file path
        #[arg(short, long, value_name = "FILE")]
        output: Option<PathBuf>,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    let result = match cli.command {
        Commands::Process { path } => commands::process(&path).await,
        Commands::Validate { config } => commands::validate(&config).await,
        Commands::Report { output } => commands::report(output.as_ref()).await,
    };

    if let Err(e) = result {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }

    Ok(())
}

