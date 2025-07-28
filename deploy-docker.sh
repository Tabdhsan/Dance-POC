#!/bin/bash

# Set variables
REPO_DIR="/mnt/git-repos/dance-poc"
DOCKER_COMPOSE_FILE="$REPO_DIR/docker-compose.yml"
DOCKER_IMAGE_NAME="dance-poc"
CONTAINER_NAME="dance-poc"

# Step 1: Navigate to the repo directory
cd $REPO_DIR || { echo "Failed to change directory to $REPO_DIR"; exit 1; }

# Step 2: Pull the latest code (assuming you're working with git)
git pull origin main || { echo "Failed to pull latest code from main"; exit 1; }

# Step 3: Build the Docker image with Docker Compose
docker-compose -f $DOCKER_COMPOSE_FILE build || { echo "Docker Compose build failed"; exit 1; }

# Step 4: Stop and remove the existing container (if running)
docker stop $CONTAINER_NAME || { echo "Failed to stop container $CONTAINER_NAME"; exit 1; }
docker rm $CONTAINER_NAME || { echo "Failed to remove container $CONTAINER_NAME"; exit 1; }

# Step 5: Start the container with the new image
docker-compose -f $DOCKER_COMPOSE_FILE up -d || { echo "Docker Compose up failed"; exit 1; }

echo "Deployment successful! The app is live."

