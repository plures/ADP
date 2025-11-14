# {{name}} PowerShell Module

PowerShell module created with architectural discipline principles.

## Installation

```powershell
# Install from local path
Import-Module .\{{name}}.psd1

# Or install to user profile
Copy-Item .\{{name}}.psd1 $env:USERPROFILE\Documents\PowerShell\Modules\{{name}}\
```

## Usage

```powershell
# Get data
Get-{{Name}}Data -ItemId "12345"

# Get data with details
Get-{{Name}}Data -ItemId "12345" -IncludeDetails

# Set configuration
Set-{{Name}}Config -ConfigPath ".\config.json" -Settings @{Timeout = 30}
```

## Architecture Analysis

Run architectural analysis:

```powershell
architectural-discipline analyze --path .
```

## Best Practices

1. Keep functions focused and under 200 lines
2. Use proper error handling with try-catch
3. Follow Verb-Noun naming convention
4. Document functions with comment-based help
5. Export only public functions









