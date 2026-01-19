#!/bin/bash

# Function to install local Node.js if missing
install_local_node() {
    echo "System Node.js not found. Attempting to install local runtime..."
    
    RUNTIME_DIR="$(pwd)/runtime"
    NODE_VERSION="v24.13.0"
    
    # Check OS and Arch
    OS="$(uname -s)"
    ARCH="$(uname -m)"
    
    if [ "$OS" != "Darwin" ]; then
        echo "Error: Auto-install only supports macOS. Please install Node.js manually."
        exit 1
    fi
    
    if [ "$ARCH" == "arm64" ]; then
        NODE_DIST="node-$NODE_VERSION-darwin-arm64"
    else
        NODE_DIST="node-$NODE_VERSION-darwin-x64"
    fi
    
    NODE_URL="https://nodejs.org/dist/$NODE_VERSION/$NODE_DIST.tar.gz"
    
    mkdir -p "$RUNTIME_DIR"
    
    if [ ! -f "$RUNTIME_DIR/$NODE_DIST/bin/node" ]; then
        echo "Downloading Node.js ($NODE_VERSION) for $ARCH..."
        curl -L -f -o "$RUNTIME_DIR/node.tar.gz" "$NODE_URL"
        
        echo "Extracting..."
        tar -xzf "$RUNTIME_DIR/node.tar.gz" -C "$RUNTIME_DIR"
        rm "$RUNTIME_DIR/node.tar.gz"
    fi
    
    # Add to PATH
    export PATH="$RUNTIME_DIR/$NODE_DIST/bin:$PATH"
    echo "Using local Node.js from: $(which node)"
    node -v
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    install_local_node
fi

# Double check
if ! command -v node &> /dev/null; then
    echo "Error: Node.js installation failed. Please install Node.js manually."
    exit 1
fi

echo "=== GovInsight-AI Setup & Run ==="

# Server Setup
echo "--- Setting up Server ---"
cd server
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "Please update server/.env with your actual QWEN_API_KEY."
fi

# Sync QWEN_API_KEY to web/.dev.vars for Wrangler
if [ -f .env ]; then
    echo "Syncing QWEN_API_KEY to web/.dev.vars..."
    # Extract QWEN_API_KEY from .env (handle optional quotes)
    API_KEY=$(grep QWEN_API_KEY .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    if [ ! -z "$API_KEY" ]; then
        echo "QWEN_API_KEY=$API_KEY" > ../web/.dev.vars
    fi
fi

echo "Installing server dependencies..."
npm install

echo "Starting server in background..."
node index.js &
SERVER_PID=$!
echo "Server started with PID $SERVER_PID"

# Web Setup
echo "--- Setting up Web Client ---"
cd ../web

echo "Installing web dependencies..."
npm install

echo "Starting web client..."
# Use concurrently or just background it. Vite is interactive by default but can run in background.
npm run dev &
WEB_PID=$!
echo "Web client started with PID $WEB_PID"

echo "=== Project is running ==="
echo "Backend (Express): http://localhost:3000"
echo "Web (Vite + Express): http://localhost:5173"
echo "Web (Cloudflare Preview): http://localhost:8788"
echo "Press Ctrl+C to stop both processes."

# Function to handle cleanup
cleanup() {
    echo "Stopping processes..."
    kill $SERVER_PID
    kill $WEB_PID
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

# Keep script running
wait
