param(
  [switch] $Strict
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$tempPath = Join-Path $env:TEMP "lattix-k8s-validation"

function Resolve-HelmBinary {
  if (Get-Command helm -ErrorAction SilentlyContinue) {
    return "helm"
  }

  $helmVersion = "v3.17.3"
  $helmRoot = Join-Path $env:TEMP "lattix-helm-$helmVersion"
  $helmExe = Join-Path $helmRoot "windows-amd64\helm.exe"
  if (-not (Test-Path $helmExe)) {
    New-Item -ItemType Directory -Force $helmRoot | Out-Null
    $archivePath = Join-Path $helmRoot "helm.zip"
    Invoke-WebRequest -Uri "https://get.helm.sh/helm-$helmVersion-windows-amd64.zip" -OutFile $archivePath
    Expand-Archive -Path $archivePath -DestinationPath $helmRoot -Force
  }
  return $helmExe
}

function Test-RenderedDeploymentDefaults {
  param(
    [string] $FilePath
  )

  $content = Get-Content -Raw $FilePath
  if ($content -notmatch "kind:\s*Deployment") {
    throw "Rendered manifests do not contain a Deployment."
  }
  if ($content -notmatch "livenessProbe:") {
    throw "Rendered Deployment is missing livenessProbe."
  }
  if ($content -notmatch "readinessProbe:") {
    throw "Rendered Deployment is missing readinessProbe."
  }
  if ($content -notmatch "resources:") {
    throw "Rendered Deployment is missing resources."
  }
}

$helm = Resolve-HelmBinary
New-Item -ItemType Directory -Force $tempPath | Out-Null
$hasKubeconform = [bool](Get-Command kubeconform -ErrorAction SilentlyContinue)
if ($Strict -and -not $hasKubeconform) {
  throw "kubeconform is required in strict mode."
}

Push-Location $repoRoot
try {
  & $helm lint kubernetes/charts/lattix-service
  if ($LASTEXITCODE -ne 0) { throw "Helm lint failed for lattix-service." }
  & $helm lint kubernetes/charts/lattix-worker
  if ($LASTEXITCODE -ne 0) { throw "Helm lint failed for lattix-worker." }

  $envs = @("local", "dev", "staging", "prod")
  foreach ($envName in $envs) {
    $serviceValues = "kubernetes/environments/$envName/lattix-service-values.yaml"
    $workerValues = "kubernetes/environments/$envName/lattix-worker-values.yaml"
    $renderedService = Join-Path $tempPath "service-$envName.yaml"
    $renderedWorker = Join-Path $tempPath "worker-$envName.yaml"
    $renderedOverlay = Join-Path $tempPath "overlay-$envName.yaml"

    & $helm template "lattix-service-$envName" kubernetes/charts/lattix-service -f $serviceValues | Set-Content -Path $renderedService -Encoding utf8
    if ($LASTEXITCODE -ne 0) { throw "Helm template failed for lattix-service ($envName)." }

    & $helm template "lattix-worker-$envName" kubernetes/charts/lattix-worker -f $workerValues | Set-Content -Path $renderedWorker -Encoding utf8
    if ($LASTEXITCODE -ne 0) { throw "Helm template failed for lattix-worker ($envName)." }

    kubectl kustomize "kubernetes/environments/$envName" | Set-Content -Path $renderedOverlay -Encoding utf8
    if ($LASTEXITCODE -ne 0) { throw "kustomize render failed for environment $envName." }

    Test-RenderedDeploymentDefaults -FilePath $renderedService

    if ($hasKubeconform) {
      kubeconform -summary -ignore-missing-schemas $renderedService $renderedWorker $renderedOverlay
      if ($LASTEXITCODE -ne 0) {
        throw "kubeconform validation failed for environment $envName."
      }
    }
  }

  Write-Host "Kubernetes manifests validated successfully." -ForegroundColor Green
} finally {
  Pop-Location
}
