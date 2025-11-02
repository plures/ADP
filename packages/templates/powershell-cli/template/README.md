# {{name}} PowerShell CLI Script

PowerShell CLI script created with architectural discipline principles.

## Usage

```powershell
# Show help
.\{{name}}.ps1 -Help

# Process a target
.\{{name}}.ps1 -Action process -Target "C:\Data"

# Validate a file
.\{{name}}.ps1 -Action validate -Target "config.json"

# Generate report
.\{{name}}.ps1 -Action report -Target "output.json"
```

## Architecture Analysis

Run architectural analysis:

```powershell
architectural-discipline analyze --path .
```

## Best Practices

1. Keep script focused and under 500 lines
2. Use functions for reusable logic
3. Implement proper error handling
4. Use parameter validation
5. Provide help documentation

