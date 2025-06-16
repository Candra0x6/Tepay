import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import ora from 'ora';

/**
 * Updates the project configuration files with custom details
 * @param {string} projectPath - Path to the project directory
 * @param {string} projectName - Name of the project
 */
export async function updateProjectConfig(projectPath, projectName) {
  const spinner = ora('Customizing project configuration...').start();
  
  try {
    // Update root package.json
    const rootPackageJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(rootPackageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
      packageJson.name = projectName.toLowerCase().replace(/\s+/g, '-');
      fs.writeFileSync(rootPackageJsonPath, JSON.stringify(packageJson, null, 2));
    }
    
    // Update frontend package.json
    const frontendPackageJsonPath = path.join(projectPath, 'frontend', 'package.json');
    if (fs.existsSync(frontendPackageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(frontendPackageJsonPath, 'utf8'));
      packageJson.name = `${projectName.toLowerCase().replace(/\s+/g, '-')}-frontend`;
      fs.writeFileSync(frontendPackageJsonPath, JSON.stringify(packageJson, null, 2));
    }
    
    // Update dfx.json canister identifiers to unique values for the new project
    const dfxJsonPath = path.join(projectPath, 'dfx.json');
    if (fs.existsSync(dfxJsonPath)) {
      const dfxJson = JSON.parse(fs.readFileSync(dfxJsonPath, 'utf8'));
      
      // Reset any remote canister IDs to ensure a clean setup
      Object.keys(dfxJson.canisters || {}).forEach(canisterName => {
        if (dfxJson.canisters[canisterName].remote) {
          delete dfxJson.canisters[canisterName].remote;
        }
      });
      
      fs.writeFileSync(dfxJsonPath, JSON.stringify(dfxJson, null, 2));
    }
    
    // Create a custom README.md for the new project
    const readmePath = path.join(projectPath, 'README.md');
    fs.writeFileSync(readmePath, `# ${projectName}\n\nThis project was created with create-icp-app CLI.\n\n## Getting Started\n\n### Running the project locally\n\n\`\`\`bash\n# Start the local Internet Computer replica\ndfx start --background\n\n# Deploy your canisters to the replica and generate the candid interface\ndfx deploy\n\n# Start the development server\nnpm run dev\n\`\`\`\n\nOpen http://localhost:5173 in your browser to see the application running.\n`);
    
    spinner.succeed('Project configuration customized successfully');
  } catch (error) {
    spinner.fail('Failed to customize project configuration');
    console.error(chalk.red(`Error: ${error.message}`));
    throw error;
  }
}

/**
 * Installs project dependencies
 * @param {string} projectPath - Path to the project directory
 */
export async function installDependencies(projectPath) {
  const spinner = ora('Installing dependencies...').start();
  try {
    execSync(`cd "${projectPath}" && npm install`, { stdio: 'ignore' });
    spinner.succeed('Dependencies installed successfully');
    return true;
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    console.error(chalk.red(`Error: ${error.message}`));
    return false;
  }
}

/**
 * Checks if the necessary prerequisites are installed
 * @returns {boolean} True if all prerequisites are installed
 */
export function checkPrerequisites() {
  const spinner = ora('Checking prerequisites...').start();
  try {
    // Check for Git
    execSync('git --version', { stdio: 'ignore' });
    
    // Check for Node.js
    execSync('node --version', { stdio: 'ignore' });
    
    // Check for DFX
    try {
      execSync('dfx --version', { stdio: 'ignore' });
    } catch (error) {
      spinner.warn('DFX not found. It is required to run the ICP project.');
      console.log(chalk.yellow('To install DFX, run: sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"'));
      console.log(chalk.yellow('After installation, restart this process.'));
      return false;
    }
    
    spinner.succeed('All prerequisites installed');
    return true;
  } catch (error) {
    spinner.fail('Missing prerequisites');
    console.error(chalk.red(`Error: ${error.message}`));
    return false;
  }
}
