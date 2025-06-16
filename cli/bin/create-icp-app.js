#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';

// Import our utilities
import { updateProjectConfig, installDependencies, checkPrerequisites } from '../lib/project-setup.js';
import { getTemplateDescription, listTemplates } from '../lib/templates.js';
import { 
  checkForUpdates, 
  displayUpdateMessage, 
  getNodeVersion, 
  getNpmVersion, 
  getDfxVersion 
} from '../lib/version-check.js';

// Get the directory where the script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../config/templates.json');

// Load templates configuration if it exists, otherwise use default
let templateConfig;
let repoUrl = 'https://github.com/yourusername/icp-boiler-plate.git';

try {
  if (fs.existsSync(configPath)) {
    templateConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    repoUrl = templateConfig.templates.standard.repository;
  }
} catch (error) {
  console.warn(chalk.yellow(`Warning: Could not load template configuration. Using default repository: ${repoUrl}`));
}

// Check for updates to the CLI (don't await - run in background)
checkForUpdates().then(({ latestVersion, updateAvailable }) => {
  if (updateAvailable) {
    displayUpdateMessage(latestVersion);
  }
});

const program = new Command();

program
  .name('create-icp-app')
  .description('Create a new ICP application from a boilerplate')
  .version('1.0.0')
  .argument('[project-directory]', 'Directory to create the project in')
  .option('-t, --template <type>', 'specify project template (default: standard)')  .action(async (projectDirectory, options) => {
    try {
      console.log(chalk.bold.cyan('Create ICP App - Bootstrap your Internet Computer project'));
      
      // Check for required software
      if (!checkPrerequisites()) {
        console.log(chalk.yellow('\nPlease install the missing prerequisites and try again.'));
        process.exit(1);
      }
      
      // If no project directory is provided, prompt for one
      if (!projectDirectory) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectDirectory',
            message: 'What is your project named?',
            default: 'my-icp-app'
          }
        ]);
        projectDirectory = answers.projectDirectory;
      }
      
      // Choose template if not specified
      let template = options.template || 'standard';
      if (!options.template) {
        const templates = listTemplates();
        const templateChoices = Object.keys(templates).map(key => ({
          name: `${key} - ${templates[key].description}`,
          value: key
        }));
        
        const { selectedTemplate } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedTemplate',
            message: 'Which project template would you like to use?',
            choices: templateChoices,
            default: 'standard'
          }
        ]);
        
        template = selectedTemplate;
      }
      
      console.log(chalk.blue(`\nCreating a new ICP app in ${chalk.bold(projectDirectory)}`));
      console.log(chalk.blue(`Using template: ${chalk.bold(template)} - ${getTemplateDescription(template)}`));

      // Create the project directory if it doesn't exist
      const projectPath = path.resolve(process.cwd(), projectDirectory);
      if (fs.existsSync(projectPath)) {
        if (fs.readdirSync(projectPath).length > 0) {
          const { proceed } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'proceed',
              message: `Directory ${projectDirectory} already exists and is not empty. Do you want to continue?`,
              default: false
            }
          ]);
          if (!proceed) {
            console.log(chalk.red('Operation cancelled.'));
            process.exit(1);
          }
        }
      } else {
        fs.mkdirSync(projectPath, { recursive: true });
      }

      // Clone the template repository
      const spinner = ora('Cloning template repository...').start();
      try {
        // Using the --depth=1 flag for a shallow clone to speed up the process
        execSync(`git clone --depth=1 ${repoUrl} "${projectPath}" && cd "${projectPath}" && rm -rf .git`, { 
          stdio: 'ignore'
        });
        spinner.succeed('Template repository cloned successfully');
      } catch (error) {
        spinner.fail('Failed to clone template repository');
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }

      // Update project configuration
      await updateProjectConfig(projectPath, projectDirectory);
      
      // Install dependencies
      await installDependencies(projectPath);      // Final instructions
      console.log(chalk.green('\nSuccess! Created ICP app at', projectPath));
      console.log('Inside that directory, you can run several commands:');

      console.log(chalk.cyan('\n  npm run dev'));
      console.log('    Starts the development server.');

      console.log(chalk.cyan('\n  npm run build'));
      console.log('    Builds the app for production.');

      console.log('\nWe suggest that you begin by typing:');
      console.log(chalk.cyan(`\n  cd ${projectDirectory}`));
      console.log(chalk.cyan('  npm run dev'));
      
      // Output system information
      console.log('\nEnvironment information:');
      console.log(`  • Node.js: ${getNodeVersion()}`);
      console.log(`  • npm: ${getNpmVersion()}`);
      console.log(`  • DFX: ${getDfxVersion()}`);
      
      console.log('\nHappy coding!');

    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Add help command
program.command('env')
  .description('Display environment information')
  .action(() => {
    console.log(chalk.bold.blue('Environment Information:'));
    console.log(`• Node.js: ${getNodeVersion()}`);
    console.log(`• npm: ${getNpmVersion()}`);
    console.log(`• DFX: ${getDfxVersion()}`);
  });

program.parse();
