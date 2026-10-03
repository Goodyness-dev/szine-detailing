param (
    [Parameter(Mandatory=$true)]
    [string]$Name,
    [string]$Slug = "",
    [string]$Url = ""
)

if ($Slug -eq "") {
    $Slug = ($Name.ToLower() -replace '[^a-z0-9]+', '-').Trim('-')
}

$argsList = @("$Name", "$Slug")
if ($Url -ne "") {
    $argsList += "--url=$Url"
}

node "$PSScriptRoot\scaffold-new-project.js" @argsList
