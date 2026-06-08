Param(
    [string]$ArchivePath,
    [string]$Target = "frontend/dist"
)

$ErrorActionPreference = "Stop"

if (-not $ArchivePath) {
    Write-Error "Provide -ArchivePath pointing to a release zip in releases/."
}

$root = Resolve-Path "."
$archive = Join-Path $root $ArchivePath
$targetPath = Join-Path $root $Target

if (-not (Test-Path $archive)) {
    Write-Error "Archive not found: $archive"
}

if (Test-Path $targetPath) {
    Remove-Item -Path $targetPath -Recurse -Force
}

New-Item -Path $targetPath -ItemType Directory | Out-Null
Expand-Archive -Path $archive -DestinationPath $targetPath -Force
Write-Host "Rollback complete. Restored dist from: $archive" -ForegroundColor Yellow
