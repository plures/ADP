# {{name}} C# Class Library

C# class library created with architectural discipline principles.

## Structure

```
{{name}}/
├── Services/           # Business logic services
├── Models/            # Data models
├── Utils/             # Utility and helper classes
└── {{name}}.csproj   # Project file
```

## Building

```bash
dotnet build
```

## Running Tests

```bash
dotnet test
```

## Architecture Analysis

Run architectural analysis:

```bash
architectural-discipline analyze --path .
```

## Best Practices

1. Keep classes focused and under 400 lines
2. Use dependency injection
3. Implement proper async/await patterns
4. Use XML documentation comments
5. Follow SOLID principles

