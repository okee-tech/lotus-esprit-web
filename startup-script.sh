#!/bin/bash

# Directory of your Nuxt project
PROJECT_DIR="/path/to/your/nuxt/project"

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> /var/log/nuxt-startup.log
}

# Navigate to project directory
cd $PROJECT_DIR || {
    log "Failed to change to project directory"
    exit 1
}

# Pull latest changes
log "Pulling latest changes from git"
git pull || {
    log "Git pull failed"
    exit 1
}

# Install dependencies and build
log "Installing dependencies"
npm install || {
    log "npm install failed"
    exit 1
}

log "Building project"
npm run build || {
    log "Build failed"
    exit 1
}

# Start the preview server
log "Starting preview server"
npm run preview