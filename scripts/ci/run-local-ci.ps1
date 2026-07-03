param(
  [switch] $StrictDoctor
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")

Push-Location $repoRoot
try {
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/repository/check-structure.ps1
  $doctorArgs = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "scripts/dev/doctor.ps1")
  if ($StrictDoctor) {
    $doctorArgs += "-Strict"
  }
  powershell @doctorArgs

  if (Get-Command docker -ErrorAction SilentlyContinue) {
    docker compose --profile core config | Out-Null
    Write-Host "Docker Compose config validated."
  } else {
    Write-Host "Docker not found. Skipping Compose validation." -ForegroundColor Yellow
  }

  if (Test-Path "$env:TEMP\lattix-terraform-1.10.5\terraform.exe") {
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/infra/terraform-validate.ps1
  } elseif (Get-Command terraform -ErrorAction SilentlyContinue) {
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/infra/terraform-validate.ps1
  } else {
    Write-Host "Terraform not found. Skipping Terraform validation." -ForegroundColor Yellow
  }

  if (Get-Command kubectl -ErrorAction SilentlyContinue) {
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/k8s/validate-manifests.ps1
  } else {
    Write-Host "kubectl not found. Skipping Kubernetes manifest validation." -ForegroundColor Yellow
  }

  if (Get-Command gradle -ErrorAction SilentlyContinue) {
    gradle test --no-daemon
  } else {
    Write-Host "Gradle not found. Skipping backend test suite." -ForegroundColor Yellow
  }

  if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm typecheck
  } elseif (Get-Command corepack -ErrorAction SilentlyContinue) {
    corepack pnpm --filter @lattix/repository-manifest typecheck
    corepack pnpm --filter @lattix/dev-infrastructure typecheck
  } else {
    Write-Host "pnpm not found. Skipping TypeScript typecheck." -ForegroundColor Yellow
  }
} finally {
  Pop-Location
}
