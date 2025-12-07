terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

################################################################################
# RDS PostgreSQL Instance
################################################################################

resource "aws_db_instance" "this" {
  identifier = "${var.name}-db"

  engine               = "postgres"
  engine_version       = var.engine_version
  instance_class       = var.instance_class
  allocated_storage    = var.allocated_storage
  storage_type         = var.storage_type
  storage_encrypted    = true
  db_subnet_group_name = var.db_subnet_group_name

  vpc_security_group_ids = var.security_group_ids

  db_name  = var.database_name
  username = var.database_username
  password = var.database_password

  multi_az                = var.multi_az
  publicly_accessible     = false
  backup_retention_period = var.backup_retention_period
  skip_final_snapshot     = var.skip_final_snapshot
  deletion_protection     = var.deletion_protection
  apply_immediately       = var.apply_immediately

  performance_insights_enabled = var.performance_insights_enabled

  lifecycle {
    ignore_changes = [ca_cert_identifier]
  }

  tags = merge(var.tags, { Name = "${var.name}-db" })
}
