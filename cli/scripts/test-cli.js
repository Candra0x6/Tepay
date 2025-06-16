#!/usr/bin/env node

/**
 * This script is for local testing of the CLI.
 * It simulates running the CLI as if it was installed globally.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import chalk from 'chalk';

// Get the directory where the script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const cliPath = path.join(rootDir, 'bin', 'create-icp-app.js');

console.log(chalk.blue(`Testing create-icp-app CLI from ${cliPath}`));

// Get command line arguments (excluding node and this script)
const args = process.argv.slice(2);

console.log(chalk.yellow(`Running with args: ${args.join(' ')}`));

// Spawn CLI process with arguments
const cli = spawn('node', [cliPath, ...args], {
  stdio: 'inherit',
  env: { ...process.env }
});

// Handle CLI process events
cli.on('close', (code) => {
  if (code === 0) {
    console.log(chalk.green('\nCLI test completed successfully.'));
  } else {
    console.log(chalk.red(`\nCLI test exited with code ${code}.`));
  }
});

cli.on('error', (err) => {
  console.error(chalk.red(`Failed to start CLI: ${err.message}`));
});
