#!/usr/bin/env node

/**
 * This script prepares the CLI package for publishing to npm.
 * It validates the package and ensures all files are included correctly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import chalk from 'chalk';

// Get the directory where the script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log(chalk.blue('Preparing create-icp-app CLI for publication'));

// Check if package.json exists
const packageJsonPath = path.join(rootDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error(chalk.red('Error: package.json not found'));
  process.exit(1);
}

// Check if README.md exists
const readmePath = path.join(rootDir, 'README.md');
if (!fs.existsSync(readmePath)) {
  console.error(chalk.red('Error: README.md not found'));
  process.exit(1);
}

// Check if bin directory and main CLI script exist
const binPath = path.join(rootDir, 'bin');
const mainCliPath = path.join(binPath, 'create-icp-app.js');
if (!fs.existsSync(binPath) || !fs.existsSync(mainCliPath)) {
  console.error(chalk.red('Error: bin/create-icp-app.js not found'));
  process.exit(1);
}

// Make bin scripts executable
try {
  execSync(`chmod +x ${mainCliPath}`);
  console.log(chalk.green('Made bin/create-icp-app.js executable'));
} catch (error) {
  console.warn(chalk.yellow('Warning: Could not make bin scripts executable', error.message));
}

// Run npm pack dry run to see what would be included
try {
  console.log(chalk.blue('\nRunning npm pack --dry-run to preview package contents:'));
  execSync('npm pack --dry-run', { stdio: 'inherit' });
  
  console.log(chalk.green('\nPackage validation successful! Ready for publishing.'));
  console.log(chalk.blue('\nTo publish the package:'));
  console.log(chalk.cyan('npm login'));
  console.log(chalk.cyan('npm publish'));
} catch (error) {
  console.error(chalk.red('\nPackage validation failed:', error.message));
  process.exit(1);
}
