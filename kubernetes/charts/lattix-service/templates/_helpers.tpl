{{- define "lattix-service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "lattix-service.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "lattix-service.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "lattix-service.serviceAccountName" -}}
{{- printf "%s-%s" .Release.Name (include "lattix-service.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
