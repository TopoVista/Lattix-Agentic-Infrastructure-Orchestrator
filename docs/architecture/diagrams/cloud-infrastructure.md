# AWS Cloud Infrastructure

```mermaid
flowchart TB
  Users[Users and API clients] --> CF[CloudFront]
  CF --> ALB[Application Load Balancer]
  ALB --> EKS[EKS private workloads]

  subgraph VPC[Environment VPC]
    subgraph Public[Public subnets]
      ALB
      NAT[NAT gateways]
    end
    subgraph Private[Private subnets]
      EKS
      VPCE[Private AWS endpoints]
    end
    subgraph Data[Isolated data subnets]
      RDS[RDS PostgreSQL]
      Redis[ElastiCache Redis]
      MSK[Amazon MSK]
    end
  end

  EKS --> RDS
  EKS --> Redis
  EKS --> MSK
  EKS --> S3[Encrypted S3 artifacts]
  EKS --> SM[Secrets Manager]
  EKS --> CW[CloudWatch]
  CI[GitHub Actions OIDC] --> ECR[ECR]
  CI --> EKS
  KMS[KMS] --> RDS
  KMS --> Redis
  KMS --> MSK
  KMS --> S3
```

Every environment has separate state, network ranges, data services, Kubernetes cluster, edge resources, logs, and budgets. Production uses three availability zones and one NAT gateway per zone; lower environments use cost-reduced profiles.
