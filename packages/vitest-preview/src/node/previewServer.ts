#!/usr/bin/env node

import { registerCleanup, startServer } from '.';
import { Command } from 'commander';
import chalk from 'chalk';
import { setupAutomaticMode } from './automaticMode';

// Create a new command program
const program = new Command();

// Set up version and description
program.description(
  chalk.bold('Vitest Preview - Visual Debugging Experience for Vitest 🧪🖼⚡️'),
);

// Default command (no arguments) - start the server
program.action(() => {
  console.log(chalk.bold('\nStarting Vitest Preview Server...'));
  startServer();
  registerCleanup();
});

// Setup command with interactive mode and flags for specific features
program
  .command('setup')
  .description('Set up additional features for Vitest Preview')
  .option(
    '-a, --automaticMode',
    'Set up automatic mode for failed test debugging',
  )
  .action(async (options) => {
    // If automatic mode flag is provided
    if (options.automaticMode) {
      setupAutomaticMode();
      return;
    }

    // If no specific feature is provided, show interactive prompt
    const inquirer = await import('inquirer');
    const { selectedFeature } = await inquirer.default.prompt([
      {
        type: 'list',
        name: 'selectedFeature',
        message: 'Which feature would you like to set up?',
        choices: [
          {
            name: `${chalk.green('Automatic Mode')} - Automatically debug failed tests`,
            value: 'automatic-mode',
          },
          // Add more features here in the future
        ],
      },
    ]);

    if (selectedFeature === 'automatic-mode') {
      setupAutomaticMode();
    }
  });

// Parse arguments and execute the matching command
program.parse();
