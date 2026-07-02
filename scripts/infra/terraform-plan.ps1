param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("local", "dev", "staging", "prod")]
  [string] $Environment,
  [string] $VarFile = "terraform.tfvars",
  [string] $BackendConfig = "backend.hcl",
  [string] $OutputPath
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$environmentPath = Join-Path $repoRoot "terraform\environments\$Environment"

if (-not (Get-Command terraform -ErrorAction SilentlyContinue)) {
  throw "Terraform is required. Install Terraform 1.8 or newer."
}

if (-not (Test-Path (Join-Path $environmentPath $VarFile))) {
  throw "Variable file not found: $VarFile"
}

if (-not (Test-Path (Join-Path $environmentPath $BackendConfig))) {
  throw "Backend configuration not found: $BackendConfig"
}

if (-not $OutputPath) {
  $OutputPath = "lattix-$Environment.tfplan"
}

Push-Location $environmentPath
try {
  terraform init -input=false "-backend-config=$BackendConfig"
  if ($LASTEXITCODE -ne 0) { throw "terraform init failed." }

  terraform plan -input=false -lock-timeout=5m "-var-file=$VarFile" "-out=$OutputPath"
  if ($LASTEXITCODE -ne 0) { throw "terraform plan failed." }

  terraform show -no-color $OutputPath
}
finally {
  Pop-Location
}
