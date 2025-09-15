#!/bin/bash
set -euo pipefail

# Build and push Docker image to ECR for the portfolio Lambda function
# This script is for local development and testing

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_PROFILE="${AWS_PROFILE:-personal-dev}"
ECR_REPOSITORY="portfolio-dev-lambda"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Portfolio Lambda Container Build & Push Script${NC}"
echo "============================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    exit 1
fi

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    exit 1
fi

# Get AWS account ID
echo -e "${YELLOW}📋 Getting AWS account information...${NC}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --profile ${AWS_PROFILE} --query Account --output text)

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}❌ Failed to get AWS account ID. Check your AWS credentials.${NC}"
    exit 1
fi

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
FULL_IMAGE_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"

echo "AWS Account ID: ${AWS_ACCOUNT_ID}"
echo "ECR Registry: ${ECR_REGISTRY}"
echo "Repository: ${ECR_REPOSITORY}"
echo "Image Tag: ${IMAGE_TAG}"
echo ""

# Login to ECR
echo -e "${YELLOW}🔐 Logging into ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} --profile ${AWS_PROFILE} | \
    docker login --username AWS --password-stdin ${ECR_REGISTRY}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to login to ECR${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker build \
    --platform linux/arm64 \
    -t ${FULL_IMAGE_URI} \
    -f Dockerfile \
    .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# Get image size
IMAGE_SIZE=$(docker image inspect ${FULL_IMAGE_URI} --format='{{.Size}}' | numfmt --to=iec-i --suffix=B)
echo -e "${GREEN}✅ Image built successfully (Size: ${IMAGE_SIZE})${NC}"

# Push to ECR
echo -e "${YELLOW}📤 Pushing image to ECR...${NC}"
docker push ${FULL_IMAGE_URI}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to push image to ECR${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Image pushed successfully!${NC}"
echo ""
echo "🎉 Deployment Summary:"
echo "===================="
echo "Image URI: ${FULL_IMAGE_URI}"
echo ""
echo "To update the Lambda function with this image, run:"
echo -e "${YELLOW}aws lambda update-function-code \\
  --function-name portfolio-dev-api \\
  --image-uri ${FULL_IMAGE_URI} \\
  --region ${AWS_REGION} \\
  --profile ${AWS_PROFILE}${NC}"
echo ""
echo "Or update via Terraform with:"
echo -e "${YELLOW}terraform apply -var=\"lambda_image_uri=${FULL_IMAGE_URI}\"${NC}"