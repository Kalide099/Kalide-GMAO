Param(
    [string]$Source = "frontend/dist",
    [string]$OutDir = "releases"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path "."
$sourcePath = Join-Path $root $Source

if (-not (Test-Path $sourcePath)) {
    Write-Error "Build output not found at $sourcePath. Run frontend build first."
}

$outPath = Join-Path $root $OutDir
if (-not (Test-Path $outPath)) {
    New-Item -Path $outPath -ItemType Directory | Out-Null
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archive = Join-Path $outPath "dist-$stamp.zip"

Compress-Archive -Path (Join-Path $sourcePath '*') -DestinationPath $archive -CompressionLevel Optimal
Write-Host "Created release backup: $archive" -ForegroundColor Green
