# Cloud Tagging Policy

Every taggable Lattix resource must inherit the provider-neutral context produced by `terraform/modules/provider-abstractions`.

## Required Tags

| Tag | Purpose |
| --- | --- |
| `Project` | Product allocation; always `lattix`. |
| `Environment` | Isolation and cost boundary. |
| `Owner` | Team accountable for operation. |
| `CostCenter` | Finance allocation identifier. |
| `ManagedBy` | Change authority; always `terraform`. |
| `Repository` | Source repository; always `lattix`. |

Provider default tags are a backstop. Modules must still pass the normalized tag map to resources so ownership remains visible in plans and tests.

## Cost Controls

- Each environment has a monthly AWS Budget and optional email notifications at 80% actual and 100% forecast spend.
- Dev defaults to one NAT gateway and does not create MSK.
- Staging and production use resilient database, cache, and Kafka profiles.
- Changes to instance classes, retention, NAT count, or enabled managed services require a plan review that names monthly cost impact.
