{{- define "lattix-worker.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "lattix-worker.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" -}}
{{- end -}}

{{- define "lattix-worker.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "lattix-worker.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "lattix-worker.serviceAccountName" -}}
{{- printf "%s-%s" .Release.Name (include "lattix-worker.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
