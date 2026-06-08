Param(
    [string]$OutDir = "releases",
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
$outPath = Join-Path $root $OutDir
if (-not (Test-Path $outPath)) {
    New-Item -Path $outPath -ItemType Directory | Out-Null
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$dumpFile = Join-Path $outPath "db-$DbName-$stamp.sql"

$env:MYSQL_PWD = $dbSecretPlain
try {
    & mysqldump --host=$DbHost --port=$DbPort --user=$DbUser --single-transaction --quick --routines --events $DbName > $dumpFile
} finally {
    Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue
}

if (-not (Test-Path $dumpFile)) {
    Write-Error "Backup failed, dump file not created."
}

Write-Host "Database backup created: $dumpFile" -ForegroundColor Green
