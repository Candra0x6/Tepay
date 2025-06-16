/**
 * Utility functions to check for updates and manage CLI versions
 */
import https from 'https';
import { execSync } from 'child_process';
import chalk from 'chalk';
import semver from 'semver';

// Get the current package version from package.json
let currentVersion;
try {
  currentVersion = JSON.parse(process.env.npm_package_json || '{}').version || '1.0.0';
} catch (error) {
  currentVersion = '1.0.0';
}

/**
 * Check if there's a newer version of the CLI available on npm
 * @param {string} packageName - The name of the package
 * @returns {Promise<{latestVersion: string, updateAvailable: boolean}>} Version info
 */
export function checkForUpdates(packageName = 'create-icp-app') {
  return new Promise((resolve) => {
    const req = https.get(
      `https://registry.npmjs.org/${packageName}/latest`,
      { timeout: 3000 },
      (res) => {
        if (res.statusCode !== 200) {
          return resolve({ latestVersion: currentVersion, updateAvailable: false });
        }
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const { version } = JSON.parse(data);
            const updateAvailable = semver.gt(version, currentVersion);
            resolve({ latestVersion: version, updateAvailable });
          } catch (error) {
            resolve({ latestVersion: currentVersion, updateAvailable: false });
          }
        });
      }
    );
    
    req.on('error', () => {
      resolve({ latestVersion: currentVersion, updateAvailable: false });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ latestVersion: currentVersion, updateAvailable: false });
    });
  });
}

/**
 * Display update message if a new version is available
 * @param {string} latestVersion - The latest version available
 */
export function displayUpdateMessage(latestVersion) {
  console.log(chalk.yellow('\n---------------------------------------------------'));
  console.log(chalk.yellow(`Update available! ${chalk.dim(currentVersion)} → ${chalk.green(latestVersion)}`));
  console.log(chalk.yellow(`Run ${chalk.cyan('npm install -g create-icp-app')} to update.`));
  console.log(chalk.yellow('---------------------------------------------------\n'));
}

/**
 * Get Node.js version
 * @returns {string} Node.js version
 */
export function getNodeVersion() {
  try {
    return process.version.slice(1); // Remove the 'v' prefix
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Get npm version
 * @returns {string} npm version
 */
export function getNpmVersion() {
  try {
    return execSync('npm --version').toString().trim();
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Check if DFX is installed
 * @returns {boolean} Whether DFX is installed
 */
export function isDfxInstalled() {
  try {
    execSync('dfx --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get DFX version
 * @returns {string} DFX version
 */
export function getDfxVersion() {
  try {
    return execSync('dfx --version').toString().trim();
  } catch (error) {
    return 'not installed';
  }
}
