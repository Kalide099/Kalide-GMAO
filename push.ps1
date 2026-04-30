# KGMAO Git Push Script
git add .
$msg = Read-Host "Enter your commit message"
if (-not $msg) { $msg = "Update KGMAO platform" }
git commit -m $msg
git push origin main
Write-Host "🚀 Code pushed to GitHub successfully!" -ForegroundColor Green
