# PowerShell Example - User Management Module
# This demonstrates a typical PowerShell module with functions

function Get-UserData {
    param(
        [Parameter(Mandatory=$true)]
        [string]$UserId,
        
        [switch]$IncludeDetails
    )
    
    try {
        $user = Get-ADUser -Identity $UserId -ErrorAction Stop
        
        if ($IncludeDetails) {
            $groups = Get-ADPrincipalGroupMembership -Identity $UserId
            return @{
                User = $user
                Groups = $groups
            }
        }
        
        return $user
    }
    catch {
        Write-Error "Failed to retrieve user: $_"
        return $null
    }
}

function Set-UserStatus {
    param(
        [Parameter(Mandatory=$true)]
        [string]$UserId,
        
        [ValidateSet('Active', 'Disabled', 'Locked')]
        [string]$Status
    )
    
    $user = Get-UserData -UserId $UserId
    if ($user) {
        Set-ADUser -Identity $UserId -Enabled ($Status -eq 'Active')
        Write-Host "User status updated to: $Status"
    }
}

function Export-UserReport {
    param(
        [string]$OutputPath = ".\user-report.csv"
    )
    
    $users = Get-ADUser -Filter * | Select-Object Name, Enabled, LastLogonDate
    $users | Export-Csv -Path $OutputPath -NoTypeInformation
    Write-Output "Report exported to $OutputPath"
}

# Example usage
# Get-UserData -UserId "john.doe" -IncludeDetails
# Set-UserStatus -UserId "john.doe" -Status "Active"

