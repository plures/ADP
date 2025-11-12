# User Service Module - Main coordination
Import-Module "$PSScriptRoot\Validation.psm1" -Force
Import-Module "$PSScriptRoot\Notifications.psm1" -Force

$script:UserDatabase = @{}

function Invoke-UserProcessing {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [hashtable]$UserData,
        
        [Parameter(Mandatory=$false)]
        [string]$LogFile = ".\user-management.log"
    )
    
    # Validate user data (early return on error)
    Test-UserData -UserData $UserData
    
    # Log the operation
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogFile -Value "$timestamp - Processing user $($UserData.Id)"
    
    # Store user
    $script:UserDatabase[$UserData.Id] = $UserData
    
    # Handle notifications
    Invoke-UserNotifications -UserData $UserData -LogFile $LogFile
    
    # Handle theme
    if ($UserData.Preferences.Theme) {
        Set-UserTheme -UserId $UserData.Id -Theme $UserData.Preferences.Theme
    }
    
    # Audit logging for admin users
    if ($UserData.Role -eq 'Admin') {
        Add-Content -Path ".\audit.log" -Value "Admin user created: $($UserData.Id)"
    }
    
    # Track analytics
    $analyticsData = $UserData | ConvertTo-Json -Compress
    Add-Content -Path ".\analytics.log" -Value $analyticsData
    
    Write-Host "User $($UserData.Id) processed successfully" -ForegroundColor Green
    return $true
}

function Set-UserTheme {
    param(
        [string]$UserId,
        [string]$Theme
    )
    
    Write-Host "Applying $Theme theme for user $UserId"
}

function Get-User {
    param([string]$Id)
    return $script:UserDatabase[$Id]
}

function Get-AllUsers {
    return $script:UserDatabase.Values
}

Export-ModuleMember -Function Invoke-UserProcessing, Get-User, Get-AllUsers
