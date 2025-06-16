#!/bin/bash

# Setup script for the ICP Boilerplate repository
# Run this script to prepare both the boilerplate project and the CLI tool for development

echo -e "\033[36m🚀 Setting up ICP Boilerplate and CLI\033[0m"

# Step 1: Install dependencies for the root project
echo -e "\033[34m📦 Installing root project dependencies...\033[0m"
npm install

if [ $? -ne 0 ]; then
    echo -e "\033[31m❌ Failed to install root dependencies\033[0m"
    exit 1
fi

# Step 2: Install frontend dependencies
echo -e "\033[34m📦 Installing frontend dependencies...\033[0m"
cd frontend
npm install
cd ..

if [ $? -ne 0 ]; then
    echo -e "\033[31m❌ Failed to install frontend dependencies\033[0m"
    exit 1
fi

# Step 3: Install CLI dependencies
echo -e "\033[34m📦 Installing CLI dependencies...\033[0m"
cd cli
npm install
cd ..

if [ $? -ne 0 ]; then
    echo -e "\033[31m❌ Failed to install CLI dependencies\033[0m"
    exit 1
fi

# Step 4: Check for DFX
dfx_installed=false
if command -v dfx &> /dev/null; then
    dfx_version=$(dfx --version)
    dfx_installed=true
    echo -e "\033[32m✅ DFX found: $dfx_version\033[0m"
else
    echo -e "\033[33m⚠️ DFX not found. It is required to run the ICP project.\033[0m"
    echo -e "\033[33mTo install DFX, run: sh -ci \"$(curl -fsSL https://internetcomputer.org/install.sh)\"\033[0m"
fi

# Step 5: Link the CLI for local development
echo -e "\033[34m🔗 Linking CLI for local development...\033[0m"
cd cli
npm link
cd ..

echo -e "\n\033[32m✅ Setup completed!\033[0m"

echo -e "\n\033[36m📝 Next steps:\033[0m"
echo "1. Start the development server: npm run dev"
echo "2. Test the CLI: npx create-icp-app test-app"
if [ "$dfx_installed" = false ]; then
    echo "3. Install DFX to deploy your project to the Internet Computer"
fi

echo -e "\n\033[35m🎉 Happy coding!\033[0m"
