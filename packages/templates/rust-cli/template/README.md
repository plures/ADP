# {{name}} Rust CLI

Rust CLI application created with architectural discipline principles.

## Building

```bash
cargo build --release
```

## Running

```bash
# Show help
cargo run -- --help

# Process a file
cargo run -- process /path/to/file

# Validate configuration
cargo run -- validate --config config.json

# Generate report
cargo run -- report --output report.json
```

## Architecture Analysis

Run architectural analysis:

```bash
architectural-discipline analyze --path .
```

## Best Practices

1. Keep command modules focused
2. Use proper error handling
3. Implement async operations correctly
4. Use clap for argument parsing
5. Follow Rust best practices

