param(
  [switch] $SkipInit
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$terraformRoot = Join-Path $repoRoot "terraform"
$environments = @("local", "dev", "staging", "prod")

if (-not (Get-Command terraform -ErrorAction SilentlyContinue)) {
  throw "Terraform is required. Install Terraform 1.8 or newer."
}

Push-Location $terraformRoot
try {
  terraform fmt -check -recursive
  if ($LASTEXITCODE -ne 0) {
    throw "terraform fmt check failed."
  }
}
finally {
  Pop-Location
}

foreach ($environment in $environments) {
  $environmentPath = Join-Path $terraformRoot "environments\$environment"
  Write-Host "Validating Terraform environment: $environment" -ForegroundColor Cyan
  Push-Location $environmentPath
  try {
    if (-not $SkipInit) {
      terraform init -backend=false -input=false
      if ($LASTEXITCODE -ne 0) {
        throw "terraform init failed for $environment."
      }
    }

    terraform validate
    if ($LASTEXITCODE -ne 0) {
      throw "terraform validate failed for $environment."
    }
  }
  finally {
    Pop-Location
  }
}

Write-Host "Terraform validation passed for all environments." -ForegroundColor Green
