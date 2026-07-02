output "cluster" {
  description = "EKS cluster contract consumed by Kubernetes platform automation."
  value = {
    name              = aws_eks_cluster.this.name
    arn               = aws_eks_cluster.this.arn
    endpoint          = aws_eks_cluster.this.endpoint
    certificate_data  = aws_eks_cluster.this.certificate_authority[0].data
    version           = aws_eks_cluster.this.version
    oidc_provider_arn = aws_iam_openid_connect_provider.eks.arn
    node_role_arn     = aws_iam_role.node.arn
  }
  sensitive = true
}
