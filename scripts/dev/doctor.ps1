param(
  [switch] $Strict
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")

$requiredTools = @("git", "node", "python")
$optionalTools = @("pnpm", "java", "docker", "terraform", "kubectl", "helm", "pre-commit", "gitleaks")
$failures = New-Object System.Collections.Generic.List[string]

function Get-ToolCheck {
  param(
    [string] $Name,
    [bool] $Required
  )

  $command = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $command) {
    if ($Required) {
      $script:failures.Add("Missing required tool: $Name")
    }

    return [pscustomobject]@{
      Name = $Name
      Required = $Required
      Available = $false
      Version = ""
    }
  }

  $version = ""
  try {
    $version = (& $Name --version 2>&1 | Select-Object -First 1) -join ""
  } catch {
    $version = "available"
  }

  return [pscustomobject]@{
    Name = $Name
    Required = $Required
    Available = $true
    Version = $version
  }
}

$checks = @()
foreach ($tool in $requiredTools) {
  $checks += Get-ToolCheck -Name $tool -Required $true
}
foreach ($tool in $optionalTools) {
  $checks += Get-ToolCheck -Name $tool -Required $false
}

$envFiles = @(
  "config/env/local.env.example",
  "config/env/services.env.example",
  "config/env/profiles.json"
)

foreach ($envFile in $envFiles) {
  if (-not (Test-Path (Join-Path $repoRoot $envFile))) {
    $failures.Add("Missing environment file: $envFile")
  }
}

Write-Host "Lattix doctor report"
Write-Host "Repository: $repoRoot"
Write-Host ""

$checks | Format-Table Name,Required,Available,Version -AutoSize

if ($failures.Count -gt 0) {
  Write-Host "Failures:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }

  if ($Strict) {
    exit 1
  }
}

Write-Host "Environment files checked: $($envFiles.Count)"
Write-Host "Doctor check completed."
