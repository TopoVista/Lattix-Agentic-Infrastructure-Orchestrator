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

$phase02Paths = @(
  "docker-compose.yml",
  ".devcontainer\devcontainer.json",
  ".vscode\extensions.json",
  ".vscode\settings.json",
  ".pre-commit-config.yaml",
  ".yamllint.yml",
  "commitlint.config.cjs",
  ".github\workflows\ci.yml",
  ".github\workflows\security.yml",
  ".github\workflows\infrastructure.yml",
  ".github\workflows\docs.yml",
  "config\env\local.env.example",
  "config\env\services.env.example",
  "config\env\profiles.json",
  "shared\dev-infrastructure\src\index.ts",
  "scripts\dev\setup.ps1",
  "scripts\dev\doctor.ps1",
  "scripts\dev\start-dependencies.ps1",
  "scripts\ci\run-local-ci.ps1",
  "devops\hooks\commit-msg.sample"
)

$phase03Paths = @(
  "terraform\bootstrap\main.tf",
  "terraform\stacks\aws-platform\main.tf",
  "terraform\modules\provider-abstractions\main.tf",
  "terraform\modules\aws-network\main.tf",
  "terraform\modules\aws-identity\main.tf",
  "terraform\modules\aws-data\main.tf",
  "terraform\modules\aws-kubernetes\main.tf",
  "terraform\modules\aws-edge\main.tf",
  "terraform\modules\aws-observability\main.tf",
  "terraform\environments\local\main.tf",
  "terraform\environments\dev\main.tf",
  "terraform\environments\staging\main.tf",
  "terraform\environments\prod\main.tf",
  "cloud\provider-capabilities.yaml",
  "cloud\aws\accounts.example.yaml",
  "cloud\gcp\provider-contract.yaml",
  "cloud\azure\provider-contract.yaml",
  "scripts\infra\terraform-validate.ps1",
  "scripts\infra\terraform-plan.ps1",
  ".checkov.yml",
  ".tflint.hcl",
  "docs\architecture\diagrams\cloud-infrastructure.md",
  "docs\operations\cloud-tagging-policy.md",
  "docs\operations\terraform-runbook.md"
)

$phase04Paths = @(
  "kubernetes\base\kustomization.yaml",
  "kubernetes\base\namespaces\namespaces.yaml",
  "kubernetes\base\policies\default-deny-networkpolicy.yaml",
  "kubernetes\base\policies\allow-approved-flows.yaml",
  "kubernetes\base\policies\resource-quotas.yaml",
  "kubernetes\base\policies\limit-ranges.yaml",
  "kubernetes\base\ingress\gateway-ingress.yaml",
  "kubernetes\base\ingress\internal-tools-ingress.yaml",
  "kubernetes\base\mesh\istio-mtls.yaml",
  "kubernetes\base\mesh\traffic-policy.yaml",
  "kubernetes\base\secrets\cluster-secret-store.yaml",
  "kubernetes\base\secrets\external-secrets.yaml",
  "kubernetes\environments\local\kustomization.yaml",
  "kubernetes\environments\dev\kustomization.yaml",
  "kubernetes\environments\staging\kustomization.yaml",
  "kubernetes\environments\prod\kustomization.yaml",
  "kubernetes\operators\kustomization.yaml",
  "kubernetes\charts\lattix-service\values.schema.json",
  "kubernetes\charts\lattix-worker\values.schema.json",
  "scripts\k8s\validate-manifests.ps1",
  "config\env\kubernetes.env.example",
  ".github\workflows\kubernetes-platform.yml"
)

$phase05Paths = @(
  "services\_template\build.gradle.kts",
  "services\_template\Dockerfile",
  "services\auth-service\build.gradle.kts",
  "services\user-service\build.gradle.kts",
  "services\workspace-service\build.gradle.kts",
  "services\repository-service\build.gradle.kts",
  "services\project-service\build.gradle.kts",
  "services\notification-service\build.gradle.kts",
  "services\tool-service\build.gradle.kts",
  "services\search-service\build.gradle.kts",
  "services\knowledge-service\build.gradle.kts",
  "services\memory-service\build.gradle.kts",
  "services\document-service\build.gradle.kts",
  "services\analytics-service\build.gradle.kts",
  "services\logging-service\build.gradle.kts",
  "services\monitoring-service\build.gradle.kts",
  "shared\backend\src\main\java\com\lattix\shared\backend\web\ApiResponse.java",
  "shared\backend\src\main\java\com\lattix\shared\backend\web\ErrorResponse.java",
  "shared\backend\src\main\java\com\lattix\shared\backend\security\CurrentPrincipal.java",
  "shared\events\src\main\java\com\lattix\shared\events\KafkaEventPublisher.java",
  "shared\integration-test\src\main\java\com\lattix\shared\integration\IntegrationTestBase.java",
  "shared\persistence\src\main\resources\db\migration\V1__init.sql",
  "shared\test\src\main\java\com\lattix\shared\test\TestSecurityConfig.java"
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

foreach ($phase02Path in $phase02Paths) {
  Assert-PathExists -RelativePath $phase02Path -Description "Phase 02 artifact"
}

foreach ($phase03Path in $phase03Paths) {
  Assert-PathExists -RelativePath $phase03Path -Description "Phase 03 artifact"
}

foreach ($phase04Path in $phase04Paths) {
  Assert-PathExists -RelativePath $phase04Path -Description "Phase 04 artifact"
}

foreach ($phase05Path in $phase05Paths) {
  Assert-PathExists -RelativePath $phase05Path -Description "Phase 05 artifact"
}

if ($failures.Count -gt 0) {
  Write-Host "Repository structure check failed:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Repository structure check passed." -ForegroundColor Green
Write-Host "Validated $($manifest.modules.Count) modules, $($requiredRootFiles.Count) root files, $($phase02Paths.Count) Phase 02 artifacts, $($phase03Paths.Count) Phase 03 artifacts, $($phase04Paths.Count) Phase 04 artifacts, and $($phase05Paths.Count) Phase 05 artifacts."
