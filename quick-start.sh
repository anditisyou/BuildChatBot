#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting DSL Chatbot Platform...${NC}"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
fi

# Create storage if not exists
mkdir -p storage
if [ ! -f "storage/bots.json" ]; then
    echo "{}" > storage/bots.json
fi

# Start the server
echo -e "${GREEN}Server starting at http://localhost:5000${NC}"
echo -e "${GREEN}Health check: http://localhost:5000/api/health${NC}\n"

npm run dev