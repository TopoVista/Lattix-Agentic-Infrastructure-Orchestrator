data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "permissions_boundary" {
  statement {
    sid       = "AllowApprovedActions"
    effect    = "Allow"
    actions   = ["*"]
    resources = ["*"]
  }

  statement {
    sid    = "DenyDisablingSecurityServices"
    effect = "Deny"
    actions = [
      "cloudtrail:DeleteTrail",
      "cloudtrail:StopLogging",
      "config:DeleteConfigurationRecorder",
      "config:StopConfigurationRecorder",
      "guardduty:DeleteDetector"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "permissions_boundary" {
  name        = "${var.name_prefix}-permissions-boundary"
  description = "Maximum permissions available to Lattix automation and workloads"
  policy      = data.aws_iam_policy_document.permissions_boundary.json
  tags        = var.tags
}

resource "aws_iam_openid_connect_provider" "github" {
  count = var.github_repository == null ? 0 : 1

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
  tags            = var.tags
}

data "aws_iam_policy_document" "ci_assume" {
  count = var.github_repository == null ? 0 : 1

  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github[0].arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [for branch in var.github_branches : "repo:${var.github_repository}:ref:${branch}"]
    }
  }
}

resource "aws_iam_role" "ci" {
  count = var.github_repository == null ? 0 : 1

  name                 = "${var.name_prefix}-github-ci"
  assume_role_policy   = data.aws_iam_policy_document.ci_assume[0].json
  permissions_boundary = aws_iam_policy.permissions_boundary.arn
  max_session_duration = 3600
  tags                 = var.tags
}

resource "aws_iam_role_policy_attachment" "ci" {
  for_each = var.github_repository == null ? toset([]) : var.ci_policy_arns

  role       = aws_iam_role.ci[0].name
  policy_arn = each.value
}

data "aws_iam_policy_document" "operator_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type = "AWS"
      identifiers = length(var.operator_principal_arns) > 0 ? var.operator_principal_arns : [
        "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
      ]
    }

    condition {
      test     = "Bool"
      variable = "aws:MultiFactorAuthPresent"
      values   = ["true"]
    }
  }
}

resource "aws_iam_role" "operator" {
  name                 = "${var.name_prefix}-operator"
  assume_role_policy   = data.aws_iam_policy_document.operator_assume.json
  permissions_boundary = aws_iam_policy.permissions_boundary.arn
  max_session_duration = 3600
  tags                 = var.tags
}

resource "aws_iam_role_policy" "operator_read" {
  name = "read-platform-state"
  role = aws_iam_role.operator.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "cloudwatch:Get*",
        "cloudwatch:List*",
        "ec2:Describe*",
        "eks:Describe*",
        "eks:List*",
        "logs:Get*",
        "logs:Describe*",
        "logs:FilterLogEvents",
        "rds:Describe*"
      ]
      Resource = "*"
    }]
  })
}
