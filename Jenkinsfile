pipeline {
    agent any

    environment {
        AWS_REGION     = 'us-west-2'
        ECR_REGISTRY   = '784167813131.dkr.ecr.us-west-2.amazonaws.com'
        BACKEND_IMAGE  = "${ECR_REGISTRY}/taskflow-backend"
        FRONTEND_IMAGE = "${ECR_REGISTRY}/taskflow-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                     credentialsId: 'aws-credentials', 
                                     accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                     secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                        
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                        
                        // Backend
                        dir('backend') {
                            sh "docker build -t ${BACKEND_IMAGE}:${env.BUILD_ID} -t ${BACKEND_IMAGE}:latest ."
                            sh "docker push ${BACKEND_IMAGE}:${env.BUILD_ID}"
                            sh "docker push ${BACKEND_IMAGE}:latest"
                        }
                        
                        // Frontend
                        dir('frontend') {
                            sh "docker build -t ${FRONTEND_IMAGE}:${env.BUILD_ID} -t ${FRONTEND_IMAGE}:latest ."
                            sh "docker push ${FRONTEND_IMAGE}:${env.BUILD_ID}"
                            sh "docker push ${FRONTEND_IMAGE}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                     credentialsId: 'aws-credentials', 
                                     accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                     secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                        
                        // Update kubeconfig
                        sh "aws eks update-kubeconfig --region ${AWS_REGION} --name taskflow-prod-cluster"
                        
                        // Step 1: Create namespace first
                        sh 'kubectl apply -f k8s/namespace.yaml'
                        
                        // Wait for namespace to be ready
                        sh 'sleep 15'
                        
                        // Step 2: Apply all other Kubernetes resources
                        sh 'kubectl apply -f k8s/'
                        
                        // Step 3: Update image versions (safe even if deployment doesn't exist yet)
                        sh "kubectl set image deployment/backend-deployment backend=${BACKEND_IMAGE}:${env.BUILD_ID} -n taskflow || true"
                        sh "kubectl set image deployment/frontend-deployment frontend=${FRONTEND_IMAGE}:${env.BUILD_ID} -n taskflow || true"
                    }
                }
            }
        }
    }
}