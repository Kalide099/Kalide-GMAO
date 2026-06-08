Param(
    [Parameter(Mandatory = $true)]
    [string]$DumpPath,
    [string]$DbName = $env:DB_NAME,
    [string]$DbHost = $env:DB_HOST,
    [string]$DbPort = $env:DB_PORT,
    [string]$DbUser = $env:DB_USER
)

$ErrorActionPreference = "Stop"

if (-not $DbName -or -not $DbHost -or -not $DbPort -or -not $DbUser) {
    Write-Error "DB_NAME, DB_HOST, DB_PORT, DB_USER must be set (env or parameters)."
}

$DbSecret = $null
if ($env:DB_PASSWORD) {
    $DbSecret = ConvertTo-SecureString $env:DB_PASSWORD -AsPlainText -Force
}

if (-not $DbSecret) {
    $DbSecret = Read-Host "Enter database password" -AsSecureString
}

$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($DbSecret)
$dbSecretPlain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

$root = Resolve-Path "."
$dumpFile = Join-Path $root $DumpPath

if (-not (Test-Path $dumpFile)) {
    Write-Error "Dump file not found: $dumpFile"
}

$env:MYSQL_PWD = $dbSecretPlain
try {
    Get-Content $dumpFile | & mysql --host=$DbHost --port=$DbPort --user=$DbUser $DbName
} finally {
    Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue
}

Write-Host "Database restore completed from: $dumpFile" -ForegroundColor Yellow
