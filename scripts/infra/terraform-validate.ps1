param(
  [switch] $SkipInit
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$terraformRoot = Join-Path $repoRoot "terraform"
$environments = @("local", "dev", "staging", "prod")

function Resolve-TerraformBinary {
  if (Get-Command terraform -ErrorAction SilentlyContinue) {
    return "terraform"
  }

  $version = "1.10.5"
  $installDir = Join-Path $env:TEMP "lattix-terraform-$version"
  $terraformExe = Join-Path $installDir "terraform.exe"
  if (-not (Test-Path $terraformExe)) {
    New-Item -ItemType Directory -Force $installDir | Out-Null
    $archivePath = Join-Path $installDir "terraform.zip"
    Invoke-WebRequest -Uri "https://releases.hashicorp.com/terraform/$version/terraform_${version}_windows_amd64.zip" -OutFile $archivePath
    Expand-Archive -Path $archivePath -DestinationPath $installDir -Force
  }

  return $terraformExe
}

$terraform = Resolve-TerraformBinary

Push-Location $terraformRoot
try {
  & $terraform fmt -check -recursive
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
      & $terraform init -backend=false -input=false
      if ($LASTEXITCODE -ne 0) {
        throw "terraform init failed for $environment."
      }
    }

    & $terraform validate
    if ($LASTEXITCODE -ne 0) {
      throw "terraform validate failed for $environment."
    }
  }
  finally {
    Pop-Location
  }
}

Write-Host "Terraform validation passed for all environments." -ForegroundColor Green
