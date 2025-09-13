terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

################################################################################
# DynamoDB Table
################################################################################

resource "aws_dynamodb_table" "this" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"  # No need to manage capacity, scales automatically
  hash_key     = "PK"
  range_key    = "SK"

  # Partition and Sort keys
  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  # GSI for querying by entity type
  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  # Enable TTL for temporary data
  ttl {
    enabled        = true
    attribute_name = "ttl"
  }

  # Enable point-in-time recovery
  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  # Encryption at rest (uses AWS managed key by default)
  server_side_encryption {
    enabled = true
  }

  tags = merge(
    var.tags,
    {
      Name = var.table_name
    }
  )
}