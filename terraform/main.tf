provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "taskflow_vpc" {
  cidr_block = var.vpc_cidr
  tags = {
    Name = "TaskFlowVPC"
  }
}

resource "aws_eks_cluster" "taskflow_cluster" {
  name     = "taskflow-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = aws_subnet.taskflow_subnets[*].id
  }
}

resource "aws_iam_role" "eks_cluster_role" {
  name = "taskflow-eks-cluster-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_subnet" "taskflow_subnets" {
  count             = 2
  vpc_id            = aws_vpc.taskflow_vpc.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone = element(var.availability_zones, count.index)
}
