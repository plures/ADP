# Notification Module - Handles notifications
function Send-UserEmail {
    [CmdletBinding()]
    param(
        [string]$Email,
        [string]$Message,
        [string]$LogFile
    )
    
    Write-Host "Sending email to $Email: $Message"
    Add-Content -Path $LogFile -Value "Email sent to $Email"
}

function Send-UserSMS {
    [CmdletBinding()]
    param(
        [string]$Phone,
        [string]$Message,
        [string]$LogFile
    )
    
    Write-Host "Sending SMS to $Phone: $Message"
    Add-Content -Path $LogFile -Value "SMS sent to $Phone"
}

function Invoke-UserNotifications {
    [CmdletBinding()]
    param(
        [hashtable]$UserData,
        [string]$LogFile
    )
    
    if (-not $UserData.Preferences.Notifications) { return }
    
    if ($UserData.Preferences.Notifications.Email) {
        Send-UserEmail -Email $UserData.Email -Message "Welcome!" -LogFile $LogFile
    }
    
    if ($UserData.Preferences.Notifications.SMS -and $UserData.Phone) {
        Send-UserSMS -Phone $UserData.Phone -Message "Welcome!" -LogFile $LogFile
    }
}

Export-ModuleMember -Function Send-UserEmail, Send-UserSMS, Invoke-UserNotifications
