output "alerts_topic_arn" {
  description = "SNS topic receiving platform and budget alerts."
  value       = aws_sns_topic.alerts.arn
}

output "log_group_names" {
  description = "CloudWatch application log groups keyed by workload."
  value       = { for name, group in aws_cloudwatch_log_group.application : name => group.name }
}

output "dashboard_name" {
  description = "CloudWatch platform dashboard name."
  value       = aws_cloudwatch_dashboard.platform.dashboard_name
}
