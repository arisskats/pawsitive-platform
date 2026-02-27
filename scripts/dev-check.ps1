param(
  [int]$FrontendPort = 3000,
  [int]$BackendPort = 3001
)

$ErrorActionPreference = 'Continue'

Write-Host "== Gateway =="
openclaw gateway status
openclaw gateway probe

Write-Host "`n== Ports =="
netstat -ano | Select-String ":$FrontendPort|:$BackendPort"

Write-Host "`n== HTTP smoke =="
try {
  $f = Invoke-WebRequest -Uri "http://localhost:$FrontendPort" -UseBasicParsing -TimeoutSec 5
  Write-Host "Frontend OK: $($f.StatusCode)"
} catch {
  Write-Host "Frontend FAIL: $($_.Exception.Message)"
}

try {
  $b = Invoke-WebRequest -Uri "http://localhost:$BackendPort/community/alerts" -UseBasicParsing -TimeoutSec 5
  Write-Host "Backend OK: $($b.StatusCode)"
} catch {
  Write-Host "Backend FAIL: $($_.Exception.Message)"
}

Write-Host "`nDone."
