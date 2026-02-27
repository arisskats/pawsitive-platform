param(
  [int]$FrontendPort = 3000,
  [int]$BackendPort = 3001
)

$ErrorActionPreference = 'SilentlyContinue'

function Stop-PortProcess([int]$port) {
  $lines = netstat -ano | Select-String ":$port"
  $pids = @()
  foreach ($line in $lines) {
    $parts = ($line -replace '\s+', ' ').Trim().Split(' ')
    if ($parts.Length -ge 5) {
      $pid = $parts[-1]
      if ($pid -match '^\d+$') { $pids += [int]$pid }
    }
  }
  $pids = $pids | Sort-Object -Unique
  foreach ($pid in $pids) {
    Write-Host "Stopping PID $pid on port $port"
    Stop-Process -Id $pid -Force
  }
}

Write-Host "[1/4] Cleaning stale processes on ports $FrontendPort / $BackendPort..."
Stop-PortProcess -port $FrontendPort
Stop-PortProcess -port $BackendPort

Write-Host "[2/4] Starting backend..."
Start-Process powershell -ArgumentList '-NoExit','-Command','cd "C:\Users\user\Desktop\projects\pawsitive-platform\backend"; npm run start:dev'

Start-Sleep -Seconds 2

Write-Host "[3/4] Starting frontend..."
Start-Process powershell -ArgumentList '-NoExit','-Command','cd "C:\Users\user\Desktop\projects\pawsitive-platform\frontend"; npm run dev'

Start-Sleep -Seconds 2

Write-Host "[4/4] Quick port check..."
netstat -ano | Select-String ":$FrontendPort|:$BackendPort"

Write-Host "Done. Frontend: http://localhost:$FrontendPort  Backend: http://localhost:$BackendPort"
