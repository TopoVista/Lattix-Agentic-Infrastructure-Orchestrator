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
  & $terraform init -input=false "-backend-config=$BackendConfig"
  if ($LASTEXITCODE -ne 0) { throw "terraform init failed." }

  & $terraform plan -input=false -lock-timeout=5m "-var-file=$VarFile" "-out=$OutputPath"
  if ($LASTEXITCODE -ne 0) { throw "terraform plan failed." }

  & $terraform show -no-color $OutputPath
}
finally {
  Pop-Location
}
