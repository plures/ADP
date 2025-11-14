#
# Module manifest for '{{name}}'
#

@{
    RootModule        = '{{name}}.psm1'
    ModuleVersion     = '1.0.0'
    GUID              = '{{guid}}'
    Author            = ''
    CompanyName       = ''
    Copyright         = ''
    Description       = 'PowerShell module with architectural discipline'
    PowerShellVersion = '5.1'
    
    FunctionsToExport = @(
        'Get-{{Name}}Data',
        'Set-{{Name}}Config'
    )
    
    CmdletsToExport   = @()
    VariablesToExport = @()
    AliasesToExport   = @()
    
    PrivateData       = @{
        PSData = @{
            Tags         = @('architecture', 'discipline')
            LicenseUri   = ''
            ProjectUri   = ''
            IconUri      = ''
            ReleaseNotes = 'Initial release'
        }
    }
}









