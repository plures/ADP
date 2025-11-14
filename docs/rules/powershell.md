# ADP Rule Catalog - PowerShell

**Version:** 1.0.0  
**Last Updated:** 2024-11-12

This document describes architectural discipline rules for PowerShell scripts and modules.

## Overview

ADP analyzes PowerShell scripts (.ps1), modules (.psm1), and data files (.psd1) to ensure maintainable, well-structured PowerShell code following community best practices.

## PowerShell-Specific Considerations

PowerShell code often has different patterns than traditional OOP languages:
- Cmdlet-based architecture
- Pipeline-oriented processing
- Mixed procedural and functional styles
- Heavy use of parameter sets

---

## Size Rules

### `max-lines`

**Thresholds for PowerShell:**

| File Type | Expected Range | Description |
|-----------|----------------|-------------|
| Module (.psm1) | 100-400 lines | Complete module with multiple functions |
| Script (.ps1) | 50-200 lines | Standalone script |
| Manifest (.psd1) | 50-150 lines | Module manifest |
| Function | 30-100 lines | Individual function within module |

**Example Violation:**

```powershell
# ❌ BAD: 500-line monolithic module
function Invoke-ComplexOperation {
    [CmdletBinding()]
    param(...)
    
    # 100+ lines of parameter validation
    # 200+ lines of business logic
    # 100+ lines of error handling
    # 100+ lines of output formatting
}
```

**Recommended Fix:**

```powershell
# ✅ GOOD: Separated into focused functions
function Invoke-ComplexOperation {
    [CmdletBinding()]
    param(...)
    
    Test-Parameters $PSBoundParameters
    $result = Start-BusinessLogic $PSBoundParameters
    Format-Output $result
}

function Test-Parameters { /* 30 lines */ }
function Start-BusinessLogic { /* 80 lines */ }
function Format-Output { /* 40 lines */ }
```

---

## Complexity Rules

### `max-complexity`

**PowerShell Complexity Sources:**
- If/ElseIf/Else statements
- Switch statements
- While/Do-While loops
- ForEach loops
- Try/Catch blocks
- Pipeline operators with Where-Object/ForEach-Object
- Parameter validation attributes

**Thresholds:**

| Script Type | Complexity Threshold |
|-------------|---------------------|
| Cmdlet Function | 8 |
| Advanced Function | 10 |
| Script Block | 6 |
| Helper Function | 5 |

**Example Violation:**

```powershell
# ❌ BAD: Complexity = 16
function Get-UserStatus {
    param($User)
    
    if ($User) {
        if ($User.IsActive) {
            if ($User.Department) {
                if ($User.Department -eq 'IT') {
                    if ($User.Role -eq 'Admin') {
                        return "IT Admin"
                    } elseif ($User.Role -eq 'User') {
                        return "IT User"
                    }
                } elseif ($User.Department -eq 'Sales') {
                    if ($User.Role -eq 'Manager') {
                        return "Sales Manager"
                    } else {
                        return "Sales Rep"
                    }
                }
            }
        } else {
            return "Inactive"
        }
    }
    return "Unknown"
}
```

**Recommended Fix:**

```powershell
# ✅ GOOD: Complexity = 3 per function
function Get-UserStatus {
    param($User)
    
    if (-not $User -or -not $User.IsActive) {
        return if ($User) { "Inactive" } else { "Unknown" }
    }
    
    Get-DepartmentStatus -Department $User.Department -Role $User.Role
}

function Get-DepartmentStatus {
    param($Department, $Role)
    
    $statusMap = @{
        'IT' = @{ 'Admin' = 'IT Admin'; 'User' = 'IT User' }
        'Sales' = @{ 'Manager' = 'Sales Manager'; 'Default' = 'Sales Rep' }
    }
    
    $deptRoles = $statusMap[$Department]
    return $deptRoles[$Role] ?? $deptRoles['Default'] ?? "Unknown Role"
}
```

---

## PowerShell Best Practices

### `approved-verbs`

**Rule ID:** `approved-verbs`  
**Category:** Naming  
**Severity:** Warning  
**Autofix:** Not available

**Description:**  
PowerShell functions should use approved verbs (Get, Set, New, Remove, etc.)

**Rationale:**
- Consistency across PowerShell ecosystem
- Predictable command discovery
- Better IDE support

**Approved Verb Categories:**
- Common: Get, Set, New, Remove, Add, Clear, etc.
- Communications: Connect, Disconnect, Read, Write, etc.
- Data: Backup, Checkpoint, Compare, Compress, etc.
- Diagnostic: Debug, Measure, Ping, Test, Trace, etc.
- Lifecycle: Approve, Complete, Confirm, Deny, etc.
- Security: Block, Grant, Protect, Revoke, Unblock, etc.

**Example Violation:**

```powershell
# ❌ BAD: Non-approved verbs
function Fetch-UserData { }
function Create-Report { }
function Delete-File { }
```

**Recommended Fix:**

```powershell
# ✅ GOOD: Approved verbs
function Get-UserData { }
function New-Report { }
function Remove-File { }
```

---

### `proper-error-handling`

**Rule ID:** `proper-error-handling`  
**Category:** Robustness  
**Severity:** Warning  
**Autofix:** Not available

**Description:**  
Functions should use proper error handling with Try/Catch or ErrorAction parameters.

**Example Violation:**

```powershell
# ❌ BAD: No error handling
function Get-UserFromAD {
    param($UserName)
    Get-ADUser -Identity $UserName  # May throw unhandled error
}
```

**Recommended Fix:**

```powershell
# ✅ GOOD: Proper error handling
function Get-UserFromAD {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$UserName
    )
    
    try {
        Get-ADUser -Identity $UserName -ErrorAction Stop
    }
    catch [Microsoft.ActiveDirectory.Management.ADIdentityNotFoundException] {
        Write-Error "User '$UserName' not found in Active Directory"
        return $null
    }
    catch {
        Write-Error "Failed to retrieve user: $_"
        throw
    }
}
```

---

### `cmdletbinding-usage`

**Rule ID:** `cmdletbinding-usage`  
**Category:** Best Practice  
**Severity:** Informational  
**Autofix:** Not available

**Description:**  
Advanced functions should use [CmdletBinding()] to enable common parameters.

**Benefits:**
- Automatic common parameters (Verbose, Debug, ErrorAction, etc.)
- Better error handling
- Consistent behavior with built-in cmdlets

**Example:**

```powershell
# ✅ GOOD: Using CmdletBinding
function Get-ProcessInfo {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$ProcessName
    )
    
    Write-Verbose "Searching for process: $ProcessName"
    Get-Process -Name $ProcessName
}

# Now supports: Get-ProcessInfo -ProcessName notepad -Verbose
```

---

## Configuration

```json
{
  "architectural-discipline": {
    "languages": {
      "powershell": {
        "maxLines": 300,
        "maxComplexity": 10,
        "maxLinesPerFunction": 100,
        "enforceApprovedVerbs": true
      }
    }
  }
}
```

## Detection Patterns

ADP detects PowerShell-specific patterns:

1. **Function Definitions**: `function Name { }`, `filter Name { }`, `workflow Name { }`
2. **Parameter Blocks**: `param(...)`, `[Parameter(...)]`
3. **Pipeline Usage**: `|`, `$_`, `$PSItem`
4. **Splatting**: `@Parameters`
5. **Script Blocks**: `{ }`, `scriptblock`

## References

- [PowerShell Best Practices](https://docs.microsoft.com/en-us/powershell/scripting/developer/cmdlet/strongly-encouraged-development-guidelines)
- [Approved Verbs for PowerShell Commands](https://docs.microsoft.com/en-us/powershell/scripting/developer/cmdlet/approved-verbs-for-windows-powershell-commands)
- [The PowerShell Best Practices and Style Guide](https://poshcode.gitbook.io/powershell-practice-and-style/)
