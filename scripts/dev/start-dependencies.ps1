param(
  [ValidateSet("core", "data", "observability")]
  [string] $Profile = "core"
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$profilesPath = Join-Path $repoRoot "config/env/profiles.json"
$profiles = Get-Content -Raw $profilesPath | ConvertFrom-Json
$profileConfig = $profiles.profiles | Where-Object { $_.name -eq $Profile } | Select-Object -First 1

if (-not $profileConfig) {
  Write-Error "Unknown profile: $Profile"
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error "Docker is required to start local dependencies."
}

$args = @("compose")
foreach ($composeProfile in $profileConfig.composeProfiles) {
  $args += @("--profile", $composeProfile)
}
$args += @("up", "-d")

Write-Host "Starting Lattix local dependencies for profile '$Profile'..."
Write-Host "Enabled services: $($profileConfig.enabledServices -join ', ')"
Push-Location $repoRoot
try {
  & docker @args
} finally {
  Pop-Location
}
