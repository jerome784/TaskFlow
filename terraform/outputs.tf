output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = aws_eks_cluster.taskflow_cluster.name
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = aws_eks_cluster.taskflow_cluster.endpoint
}
