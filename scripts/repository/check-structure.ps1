$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$manifestPath = Join-Path $repoRoot "lattix.repository.json"

$requiredRootFiles = @(
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CODE_OF_CONDUCT.md",
  "LICENSE",
  ".editorconfig",
  ".gitignore",
  ".gitattributes",
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "settings.gradle.kts",
  "build.gradle.kts",
  "gradle.properties",
  "pyproject.toml",
  "lattix.repository.json"
)

$failures = New-Object System.Collections.Generic.List[string]

function Assert-PathExists {
  param(
    [string] $RelativePath,
    [string] $Description
  )

  $absolutePath = Join-Path $repoRoot $RelativePath
  if (-not (Test-Path $absolutePath)) {
    $script:failures.Add("$Description missing: $RelativePath")
  }
}

foreach ($file in $requiredRootFiles) {
  Assert-PathExists -RelativePath $file -Description "Required root file"
}

if (-not (Test-Path $manifestPath)) {
  Write-Error "Cannot continue without lattix.repository.json"
}

$manifest = Get-Content -Raw $manifestPath | ConvertFrom-Json

foreach ($module in $manifest.modules) {
  Assert-PathExists -RelativePath $module.path -Description "Module directory"
  Assert-PathExists -RelativePath (Join-Path $module.path "README.md") -Description "Module README"
}

$requiredDocPaths = @(
  "docs\product\vision.md",
  "docs\product\prd.md",
  "docs\product\personas.md",
  "docs\product\user-stories.md",
  "docs\architecture\system-context.md",
  "docs\architecture\adrs\0001-platform-architecture.md",
  "docs\architecture\api-design.md",
  "docs\architecture\database-design.md",
  "docs\architecture\event-contracts.md",
  "docs\security\threat-model.md",
  "docs\operations\cost-estimate.md",
  "docs\architecture\diagrams\README.md"
)

foreach ($docPath in $requiredDocPaths) {
  Assert-PathExists -RelativePath $docPath -Description "Phase 00 artifact"
}

if ($failures.Count -gt 0) {
  Write-Host "Repository structure check failed:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Repository structure check passed." -ForegroundColor Green
Write-Host "Validated $($manifest.modules.Count) modules and $($requiredRootFiles.Count) root metadata files."
