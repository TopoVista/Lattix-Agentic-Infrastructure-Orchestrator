$ErrorActionPreference = "Stop"

Write-Host "Setting up Lattix development helpers..."

if (Get-Command corepack -ErrorAction SilentlyContinue) {
  corepack enable
}

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
  pnpm install --no-frozen-lockfile
} else {
  Write-Host "pnpm is not installed. Install pnpm 10+ or use the devcontainer." -ForegroundColor Yellow
}

if (Get-Command pre-commit -ErrorAction SilentlyContinue) {
  pre-commit install
  pre-commit install --hook-type commit-msg
} else {
  Write-Host "pre-commit is not installed. Install it with: python -m pip install pre-commit" -ForegroundColor Yellow
}

Write-Host "Setup complete. Run scripts/dev/doctor.ps1 for a health report."
