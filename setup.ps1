# Setup script for the ICP Boilerplate repository
# Run this script to prepare both the boilerplate project and the CLI tool for development

Write-Host "🚀 Setting up ICP Boilerplate and CLI" -ForegroundColor Cyan

# Step 1: Install dependencies for the root project
Write-Host "📦 Installing root project dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

# Step 2: Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
Set-Location frontend
npm install
Set-Location ..

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Step 3: Install CLI dependencies
Write-Host "📦 Installing CLI dependencies..." -ForegroundColor Blue
Set-Location cli
npm install
Set-Location ..

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install CLI dependencies" -ForegroundColor Red
    exit 1
}

# Step 4: Check for DFX
$dfxInstalled = $false
try {
    $dfxVersion = dfx --version
    $dfxInstalled = $true
    Write-Host "✅ DFX found: $dfxVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ DFX not found. It is required to run the ICP project." -ForegroundColor Yellow
    Write-Host "To install DFX, run: sh -ci `"$(curl -fsSL https://internetcomputer.org/install.sh)`"" -ForegroundColor Yellow
    Write-Host "If you're on Windows, follow the installation guide at:" -ForegroundColor Yellow
    Write-Host "https://internetcomputer.org/docs/current/developer-docs/getting-started/install/" -ForegroundColor Yellow
}

# Step 5: Link the CLI for local development
Write-Host "🔗 Linking CLI for local development..." -ForegroundColor Blue
Set-Location cli
npm link
Set-Location ..

Write-Host "`n✅ Setup completed!" -ForegroundColor Green

Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the development server: npm run dev"
Write-Host "2. Test the CLI: npx create-icp-app test-app"
if (-not $dfxInstalled) {
    Write-Host "3. Install DFX to deploy your project to the Internet Computer"
}

Write-Host "`n🎉 Happy coding!" -ForegroundColor Magenta
