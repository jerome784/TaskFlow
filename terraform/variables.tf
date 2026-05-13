variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., prod, staging)"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "db_username" {
  description = "Master username for RDS"
  type        = string
  default     = "taskflow_admin"
}

variable "db_password" {
  description = "Master password for RDS (pass via TF_VAR_db_password)"
  type        = string
  sensitive   = true
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = []
}
