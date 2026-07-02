param(
  [switch] $StrictDoctor
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")

Push-Location $repoRoot
try {
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/repository/check-structure.ps1
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/dev/doctor.ps1 -Strict:$StrictDoctor

  if (Get-Command docker -ErrorAction SilentlyContinue) {
    docker compose --profile core config | Out-Null
    Write-Host "Docker Compose config validated."
  } else {
    Write-Host "Docker not found. Skipping Compose validation." -ForegroundColor Yellow
  }

  if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm typecheck
  } else {
    Write-Host "pnpm not found. Skipping TypeScript typecheck." -ForegroundColor Yellow
  }
} finally {
  Pop-Location
}
