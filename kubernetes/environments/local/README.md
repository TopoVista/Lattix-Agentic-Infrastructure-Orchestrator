# Local Kubernetes Environment

This folder contains local Kubernetes overlay conventions for the Lattix platform.

- Use kind or k3d for local cluster creation.
- Use `local-path` storage class for persistent volumes.
- Disable service mesh if local performance is required.
- Use `cert-manager` with self-signed issuer or local TLS.
