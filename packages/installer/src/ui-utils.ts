/**
 * UI utilities for installer
 */

import ora, { Ora } from 'ora';
import chalk from 'chalk';

/**
 * Create a standardized spinner
 */
export function createSpinner(text: string): Ora {
  return ora({
    text: chalk.gray(text),
    color: 'cyan',
    spinner: 'dots',
  });
}

/**
 * Display success message
 */
export function displaySuccess(message: string): void {
  console.log(chalk.green('✓'), chalk.white(message));
}

/**
 * Display error message
 */
export function displayError(message: string): void {
  console.error(chalk.red('✗'), chalk.white(message));
}

/**
 * Display warning message
 */
export function displayWarning(message: string): void {
  console.warn(chalk.yellow('⚠'), chalk.white(message));
}

/**
 * Display info message
 */
export function displayInfo(message: string): void {
  console.log(chalk.blue('ℹ'), chalk.white(message));
}
