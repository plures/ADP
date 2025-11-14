# PowerShell Module Demo - Before Refactoring
# This file intentionally violates architectural discipline rules

function Invoke-ComplexUserManagement {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [hashtable]$UserData,
        
        [Parameter(Mandatory=$false)]
        [string]$LogFile = ".\user-management.log"
    )
    
    # Violation 1: Deep nesting and high complexity
    # Violation 2: Multiple responsibilities in one function
    # Violation 3: Many side effects (file I/O, external calls)
    
    if ($UserData) {
        if ($UserData.Id) {
            if ($UserData.Name) {
                if ($UserData.Email) {
                    if ($UserData.Email -match "@") {
                        if ($UserData.Age) {
                            if ($UserData.Age -gt 0 -and $UserData.Age -lt 150) {
                                if ($UserData.Role) {
                                    if ($UserData.Role -in @('Admin', 'User', 'Moderator')) {
                                        
                                        # Side effect: File logging
                                        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                                        Add-Content -Path $LogFile -Value "$timestamp - Processing user $($UserData.Id)"
                                        
                                        # Side effect: Database operation simulation
                                        $script:UserDatabase = @{} | Add-Member -NotePropertyName $UserData.Id -NotePropertyValue $UserData -PassThru
                                        
                                        # Complex nested logic for preferences
                                        if ($UserData.Preferences) {
                                            if ($UserData.Preferences.Notifications) {
                                                if ($UserData.Preferences.Notifications.Email) {
                                                    # Send email notification
                                                    Write-Host "Sending email to $($UserData.Email)"
                                                    Add-Content -Path $LogFile -Value "Email sent to $($UserData.Email)"
                                                }
                                                if ($UserData.Preferences.Notifications.SMS) {
                                                    # Send SMS notification
                                                    Write-Host "Sending SMS to $($UserData.Phone)"
                                                    Add-Content -Path $LogFile -Value "SMS sent to $($UserData.Phone)"
                                                }
                                            }
                                            
                                            if ($UserData.Preferences.Theme) {
                                                if ($UserData.Preferences.Theme -eq 'Dark') {
                                                    Write-Host "Applying dark theme for user $($UserData.Id)"
                                                } elseif ($UserData.Preferences.Theme -eq 'Light') {
                                                    Write-Host "Applying light theme for user $($UserData.Id)"
                                                }
                                            }
                                        }
                                        
                                        # Audit logging
                                        if ($UserData.Role -eq 'Admin') {
                                            Add-Content -Path ".\audit.log" -Value "Admin user created: $($UserData.Id)"
                                        }
                                        
                                        # Analytics tracking
                                        $analyticsData = $UserData | ConvertTo-Json -Compress
                                        Add-Content -Path ".\analytics.log" -Value $analyticsData
                                        
                                        Write-Host "User $($UserData.Id) processed successfully" -ForegroundColor Green
                                        return $true
                                    } else {
                                        throw "Invalid role: $($UserData.Role)"
                                    }
                                } else {
                                    throw "Role is required"
                                }
                            } else {
                                throw "Age must be between 1 and 149"
                            }
                        } else {
                            throw "Age is required"
                        }
                    } else {
                        throw "Invalid email format"
                    }
                } else {
                    throw "Email is required"
                }
            } else {
                throw "Name is required"
            }
        } else {
            throw "Id is required"
        }
    } else {
        throw "UserData is required"
    }
}

function New-UserReport {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [DateTime]$StartDate,
        
        [Parameter(Mandatory=$true)]
        [DateTime]$EndDate,
        
        [Parameter(Mandatory=$false)]
        [string]$OutputFile = ".\report.txt"
    )
    
    # Violation: Complex function with multiple responsibilities
    $report = @()
    
    foreach ($user in $script:UserDatabase.Values) {
        if ($user.CreatedAt -ge $StartDate -and $user.CreatedAt -le $EndDate) {
            $userReport = "User: $($user.Name)`n"
            $userReport += "Email: $($user.Email)`n"
            $userReport += "Role: $($user.Role)`n"
            
            if ($user.LastLogin) {
                $daysSinceLogin = (Get-Date) - $user.LastLogin
                if ($daysSinceLogin.Days -gt 30) {
                    $userReport += "Status: Inactive ($($daysSinceLogin.Days) days)`n"
                } elseif ($daysSinceLogin.Days -gt 7) {
                    $userReport += "Status: Low Activity ($($daysSinceLogin.Days) days)`n"
                } else {
                    $userReport += "Status: Active`n"
                }
            }
            
            if ($user.Purchases) {
                $totalSpent = ($user.Purchases | Measure-Object -Property Amount -Sum).Sum
                $userReport += "Total Spent: `$$totalSpent`n"
                
                if ($totalSpent -gt 1000) {
                    $userReport += "Tier: Gold`n"
                } elseif ($totalSpent -gt 500) {
                    $userReport += "Tier: Silver`n"
                } else {
                    $userReport += "Tier: Bronze`n"
                }
            }
            
            $report += $userReport + "`n---`n"
        }
    }
    
    $report -join "`n" | Out-File -FilePath $OutputFile
    return $report -join "`n"
}

# Initialize user database
$script:UserDatabase = @{}

Export-ModuleMember -Function Invoke-ComplexUserManagement, New-UserReport
