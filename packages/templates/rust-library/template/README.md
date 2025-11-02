# {{name}} Rust Library

Rust library created with architectural discipline principles.

## Building

```bash
cargo build
```

## Running Tests

```bash
cargo test
```

## Usage

Add to your `Cargo.toml`:

```toml
[dependencies]
{{name}} = { path = "." }
```

## Architecture Analysis

Run architectural analysis:

```bash
architectural-discipline analyze --path .
```

## Best Practices

1. Keep modules focused and under 500 lines
2. Use proper error handling with Result types
3. Implement async functions properly
4. Use documentation comments
5. Follow Rust ownership patterns

