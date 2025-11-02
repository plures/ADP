# PowerShell Module: {{name}}
# Version: 1.0.0
# Description: PowerShell module following architectural discipline principles

# Module manifest
@{
    RootModule        = '{{name}}.psm1'
    ModuleVersion     = '1.0.0'
    GUID              = '{{guid}}'
    Author            = ''
    CompanyName       = ''
    Copyright         = ''
    Description       = 'PowerShell module with architectural discipline'
    PowerShellVersion = '5.1'
    
    # Functions to export
    FunctionsToExport = @(
        'Get-{{Name}}Data',
        'Set-{{Name}}Config'
    )
    
    # Cmdlets to export
    CmdletsToExport   = @()
    
    # Variables to export
    VariablesToExport = @()
    
    # Aliases to export
    AliasesToExport   = @()
    
    # Private data
    PrivateData       = @{
        PSData = @{
            Tags         = @('architecture', 'discipline')
            LicenseUri   = ''
            ProjectUri   = ''
            IconUri      = ''
            ReleaseNotes = ''
        }
    }
}

<#
.SYNOPSIS
    Gets data for the {{name}} module
    
.DESCRIPTION
    This function demonstrates proper PowerShell function structure
    following architectural discipline principles.
    
.PARAMETER ItemId
    The unique identifier for the item
    
.PARAMETER IncludeDetails
    Switch to include detailed information
    
.EXAMPLE
    Get-{{Name}}Data -ItemId "12345"
    
.EXAMPLE
    Get-{{Name}}Data -ItemId "12345" -IncludeDetails
#>
function Get-{{Name}}Data {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]$ItemId,
        
        [Parameter(Mandatory = $false)]
        [switch]$IncludeDetails
    )
    
    begin {
        Write-Verbose "Starting Get-{{Name}}Data for ItemId: $ItemId"
    }
    
    process {
        try {
            # Core logic here
            $result = @{
                Id = $ItemId
                Name = "Item $ItemId"
            }
            
            if ($IncludeDetails) {
                $result.Details = @{
                    Created = Get-Date
                    Status = "Active"
                }
            }
            
            return $result
        }
        catch {
            Write-Error "Failed to get {{name}} data: $_"
            throw
        }
    }
    
    end {
        Write-Verbose "Completed Get-{{Name}}Data"
    }
}

<#
.SYNOPSIS
    Sets configuration for the {{name}} module
    
.DESCRIPTION
    This function demonstrates configuration management
    following architectural discipline principles.
    
.PARAMETER ConfigPath
    Path to the configuration file
    
.PARAMETER Settings
    Hashtable of settings to apply
    
.EXAMPLE
    Set-{{Name}}Config -ConfigPath ".\config.json" -Settings @{Timeout = 30}
#>
function Set-{{Name}}Config {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory = $true)]
        [ValidateScript({Test-Path $_})]
        [string]$ConfigPath,
        
        [Parameter(Mandatory = $true)]
        [hashtable]$Settings
    )
    
    if ($PSCmdlet.ShouldProcess($ConfigPath, "Update configuration")) {
        try {
            $config = Get-Content $ConfigPath | ConvertFrom-Json
            
            foreach ($key in $Settings.Keys) {
                $config.$key = $Settings[$key]
            }
            
            $config | ConvertTo-Json -Depth 10 | Set-Content $ConfigPath
            Write-Output "Configuration updated successfully"
        }
        catch {
            Write-Error "Failed to update configuration: $_"
            throw
        }
    }
}

# Export module members
Export-ModuleMember -Function Get-{{Name}}Data, Set-{{Name}}Config

