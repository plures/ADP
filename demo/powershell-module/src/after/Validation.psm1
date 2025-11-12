# Validation Module - Pure validation functions
function Test-UserId {
    param([string]$Id)
    if ([string]::IsNullOrEmpty($Id)) { throw "Id is required" }
    return $true
}

function Test-UserName {
    param([string]$Name)
    if ([string]::IsNullOrEmpty($Name)) { throw "Name is required" }
    return $true
}

function Test-UserEmail {
    param([string]$Email)
    if ([string]::IsNullOrEmpty($Email)) { throw "Email is required" }
    if ($Email -notmatch "@") { throw "Invalid email format" }
    return $true
}

function Test-UserAge {
    param([int]$Age)
    if ($Age -le 0 -or $Age -ge 150) { throw "Age must be between 1 and 149" }
    return $true
}

function Test-UserRole {
    param([string]$Role)
    $validRoles = @('Admin', 'User', 'Moderator')
    if ([string]::IsNullOrEmpty($Role)) { throw "Role is required" }
    if ($Role -notin $validRoles) { throw "Invalid role: $Role" }
    return $true
}

function Test-UserData {
    param([hashtable]$UserData)
    if (-not $UserData) { throw "UserData is required" }
    
    Test-UserId -Id $UserData.Id
    Test-UserName -Name $UserData.Name
    Test-UserEmail -Email $UserData.Email
    Test-UserAge -Age $UserData.Age
    Test-UserRole -Role $UserData.Role
    
    return $true
}

Export-ModuleMember -Function Test-*
