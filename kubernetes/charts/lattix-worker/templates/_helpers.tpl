{{- define "lattix-worker.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "lattix-worker.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "lattix-worker.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "lattix-worker.serviceAccountName" -}}
{{- printf "%s-%s" .Release.Name (include "lattix-worker.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
