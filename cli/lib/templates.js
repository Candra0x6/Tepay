/**
 * This file serves as an example of pre-packaged templates that could be included directly in the CLI 
 * package, instead of cloning from a repository. This approach could be used in the future to support 
 * multiple templates without needing multiple repositories.
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const templates = {
  standard: {
    description: 'Standard ICP application with React frontend and Motoko backend',
    files: [
      // Structure would match your boilerplate
      'backend/app.mo',
      'backend/canisters/main.mo',
      'backend/types/lib.mo',
      // Frontend files
      'frontend/index.html',
      'frontend/index.css',
      'frontend/src/App.tsx',
      'frontend/src/main.tsx',
      // Configuration files
      'dfx.json',
      'mops.toml',
      'package.json',
      'README.md',
      // etc.
    ]
  },
  // Other templates could be defined here
  minimal: {
    description: 'Minimal ICP application with basic frontend and backend',
    files: [
      // Would define a simpler structure here
    ]
  }
};

/**
 * Copy a template to the target directory
 * @param {string} template - Template name
 * @param {string} targetDir - Target directory
 */
export async function copyTemplate(template, targetDir) {
  if (!templates[template]) {
    console.error(chalk.red(`Template "${template}" not found`));
    process.exit(1);
  }
  
  console.log(chalk.blue(`Using template: ${template} - ${templates[template].description}`));
  
  // This would copy embedded template files instead of cloning from a repo
  // For now this is just a placeholder as we're using git clone in the main script
}

/**
 * List available templates
 * @returns {object} Template definitions
 */
export function listTemplates() {
  return templates;
}

/**
 * Get template description
 * @param {string} template - Template name
 * @returns {string} Template description
 */
export function getTemplateDescription(template) {
  return templates[template]?.description || 'Unknown template';
}
