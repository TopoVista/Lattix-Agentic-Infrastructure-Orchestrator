output "backend" {
  description = "Values copied into each environment backend configuration."
  value = {
    bucket         = aws_s3_bucket.state.id
    dynamodb_table = aws_dynamodb_table.locks.name
    kms_key_id     = aws_kms_key.state.arn
    region         = var.region
  }
}
