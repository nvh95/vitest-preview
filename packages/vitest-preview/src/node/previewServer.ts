#!/usr/bin/env node

import { registerCleanup, startServer } from '.';
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';

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

// Setup command for automatic mode
program
  .command('setup')
  .description('Set up additional features for Vitest Preview')
  .argument('<feature>', 'Feature to set up (e.g., automatic-mode)')
  .action((feature) => {
    if (feature === 'automatic-mode') {
      setupAutomaticMode();
    } else {
      console.log(chalk.red(`\nUnknown feature: ${feature}`));
      console.log(`Available features: ${chalk.green('automatic-mode')}`);
    }
  });

// Parse arguments and execute the matching command
program.parse();

// Detect if the project is TypeScript or JavaScript based on config file
async function isTypeScriptProject() {
  const cwd = process.cwd();
  const possibleTsConfigs = [
    path.join(cwd, 'tsconfig.json'),
    path.join(cwd, 'tsconfig.app.json'),
    path.join(cwd, 'tsconfig.base.json'),
  ];

  // Check for TypeScript config files
  for (const configPath of possibleTsConfigs) {
    if (fs.existsSync(configPath)) {
      return true;
    }
  }

  // Check for .ts files in src directory
  const srcDir = path.join(cwd, 'src');
  if (fs.existsSync(srcDir)) {
    try {
      const files = fs.readdirSync(srcDir);
      if (files.some((file) => file.endsWith('.ts') || file.endsWith('.tsx'))) {
        return true;
      }
    } catch (error) {
      // Ignore errors reading directory
    }
  }

  // Check Vitest config file extension
  const vitestConfig = await findVitestConfig();
  if (vitestConfig && vitestConfig.path.endsWith('.ts')) {
    return true;
  }

  return false;
}

async function setupAutomaticMode() {
  console.log(chalk.bold('\nConfiguring Automatic Mode for Vitest Preview\n'));
  console.log('This will help you set up automatic debugging when tests fail.');
  console.log(
    `Please visit ${chalk.green('https://vitest-preview.com/guide/automatic-mode')} for detailed documentation.\n`,
  );

  // Ask the user which approach they want to use with inquirer
  const { approach } = await inquirer.prompt([
    {
      type: 'list',
      name: 'approach',
      message: 'Which approach would you like to configure?',
      choices: [
        {
          name: `${chalk.green('1)')} Using onTestFinished Hook ${chalk.yellow('(Recommended)')}`,
          value: '1',
        },
        {
          name: `${chalk.green('2)')} Extending the Test API with Custom Fixtures`,
          value: '2',
        },
      ],
      default: '1',
    },
  ]);

  if (approach === '1') {
    await setupApproachOne();
  } else {
    await setupApproachTwo();
  }

  console.log(chalk.bold('\nSetup complete!'));
  console.log(
    `Please review the changes made and refer to the documentation at ${chalk.green('https://vitest-preview.com/guide/automatic-mode')} for more information.\n`,
  );
}

async function setupApproachOne() {
  console.log(
    chalk.bold('\nSetting up Approach 1: Using onTestFinished Hook\n'),
  );

  // Step 1: Find and modify Vitest config
  console.log(`${chalk.bold('Step 1:')} Disabling Automatic Cleanup`);
  const vitestConfig = await findVitestConfig();
  if (vitestConfig) {
    await disableGlobalsInConfig(vitestConfig.path);
    await findAndDisableCleanup(vitestConfig.setupFiles);
  } else {
    console.log(
      chalk.red(
        'Could not find a vitest.config.* or vite.config.* file with test configuration.',
      ),
    );
    console.log(
      chalk.red('You may need to manually configure your test setup.'),
    );
  }

  // Step 2: Add onTestFinished hook
  console.log(`\n${chalk.bold('Step 2:')} Adding the onTestFinished Hook`);
  if (
    vitestConfig &&
    vitestConfig.setupFiles &&
    vitestConfig.setupFiles.length > 0
  ) {
    await addOnTestFinishedHook(vitestConfig.setupFiles[0]);
  } else {
    // Create a setup file if none exists
    const isTs = await isTypeScriptProject();
    const fileExt = isTs ? 'ts' : 'js';
    const setupFilePath = path.join(process.cwd(), `vitest.setup.${fileExt}`);
    await createSetupFile(setupFilePath);
    console.log(`Created a new setup file at ${chalk.green(setupFilePath)}`);
    console.log(
      `Make sure to add this file to your ${chalk.green("Vitest configuration's setupFiles array.")}`,
    );
  }
}

async function setupApproachTwo() {
  console.log(
    chalk.bold(
      '\nSetting up Approach 2: Extending the Test API with Custom Fixtures\n',
    ),
  );

  // Determine if project is TypeScript or JavaScript
  const isTs = await isTypeScriptProject();

  // Find or create vitest-utils file
  console.log(`${chalk.bold('Step 1:')} Creating Custom Test API`);
  const utilsPath = await findOrCreateVitestUtils(isTs);

  // Create an example test file
  console.log(`\n${chalk.bold('Step 2:')} Creating Example Test File`);
  await createExampleTestFile(isTs);
}

async function findVitestConfig() {
  const cwd = process.cwd();
  const possibleConfigs = [
    { name: 'vitest.config.ts', priority: 2 },
    { name: 'vitest.config.js', priority: 2 },
    { name: 'vitest.config.mjs', priority: 2 },
    { name: 'vitest.config.cjs', priority: 2 },
    { name: 'vite.config.ts', priority: 1 },
    { name: 'vite.config.js', priority: 1 },
    { name: 'vite.config.mjs', priority: 1 },
    { name: 'vite.config.cjs', priority: 1 },
  ];

  let highestPriorityConfig = null;
  let highestPriority = 0;

  for (const config of possibleConfigs) {
    const configPath = path.join(cwd, config.name);
    if (fs.existsSync(configPath) && config.priority >= highestPriority) {
      try {
        const content = fs.readFileSync(configPath, 'utf-8');
        if (
          content.includes('test:') ||
          content.includes("'test'") ||
          content.includes('"test"')
        ) {
          highestPriorityConfig = {
            path: configPath,
            setupFiles: await extractSetupFiles(configPath, content),
          };
          highestPriority = config.priority;
        }
      } catch (error) {
        console.error(`Error reading ${config.name}:`, error);
      }
    }
  }

  return highestPriorityConfig;
}

async function extractSetupFiles(configPath: string, content: string) {
  const setupFilesMatch = content.match(/setupFiles\s*:\s*\[([^\]]+)\]/s);
  if (!setupFilesMatch) return [];

  const setupFilesStr = setupFilesMatch[1];
  const setupFiles = setupFilesStr.match(/['"]([^'"]+)['"]\s*,?/g);
  if (!setupFiles) return [];

  const baseDir = path.dirname(configPath);
  return setupFiles
    .map((file) => file.replace(/['",\s]/g, ''))
    .filter((file) => file)
    .map((file) => {
      if (file.startsWith('./') || file.startsWith('../')) {
        return path.resolve(baseDir, file);
      }
      return file;
    })
    .filter((file) => !file.includes('node_modules'));
}

async function disableGlobalsInConfig(configPath: string) {
  try {
    let content = fs.readFileSync(configPath, 'utf-8');

    // Check if globals: true is present
    if (content.includes('globals: true')) {
      // Remove or comment out the globals line
      content = content.replace(/\s*globals\s*:\s*true\s*,?/, '');

      fs.writeFileSync(configPath, content);
      console.log(`Disabled 'globals: true' in ${chalk.green(configPath)}`);
    } else {
      console.log(
        `No 'globals: true' found in ${chalk.cyan(configPath)}. ${chalk.yellow('No changes needed.')}`,
      );
    }
  } catch (error) {
    console.error(chalk.red(`Error modifying ${configPath}:`), error);
  }
}

async function findAndDisableCleanup(setupFiles: string[]) {
  if (!setupFiles || setupFiles.length === 0) {
    console.log(chalk.yellow('No setup files found to check for cleanup.'));
    return;
  }

  for (const setupFile of setupFiles) {
    try {
      if (!fs.existsSync(setupFile)) continue;

      let content = fs.readFileSync(setupFile, 'utf-8');

      // Check for afterEach with cleanup
      if (content.includes('afterEach') && content.includes('cleanup')) {
        // Comment out the cleanup line
        content = content.replace(
          /(afterEach\s*\(\s*\(\s*\)\s*=>\s*\{\s*)(cleanup\(\)\s*;?)(\s*\}\s*\))/,
          '$1// $2 // Commented out by vitest-preview automatic mode setup$3',
        );

        fs.writeFileSync(setupFile, content);
        console.log(`Disabled automatic cleanup in ${chalk.green(setupFile)}`);
      } else {
        console.log(chalk.dim(`No cleanup call found in ${setupFile}`));
      }
    } catch (error) {
      console.error(chalk.red(`Error checking ${setupFile}:`), error);
    }
  }
}

async function addOnTestFinishedHook(setupFilePath: string) {
  try {
    if (!fs.existsSync(setupFilePath)) {
      await createSetupFile(setupFilePath);
      return;
    }

    let content = fs.readFileSync(setupFilePath, 'utf-8');

    // Check if the hook is already present
    if (content.includes('onTestFinished') && content.includes('debug()')) {
      console.log(
        chalk.yellow(
          `onTestFinished hook already exists in ${setupFilePath}. Skipping.`,
        ),
      );
      return;
    }

    // Check for existing imports
    const hasBeforeEach =
      content.includes('beforeEach') && content.includes("from 'vitest'");
    const hasCleanup =
      content.includes('cleanup') &&
      content.includes("from '@testing-library/react'");
    const hasDebug =
      content.includes('debug') && content.includes("from 'vitest-preview'");

    // Add missing imports
    let imports = '';
    if (!hasBeforeEach)
      imports += `import { beforeEach } from 'vitest';
`;
    if (!hasCleanup)
      imports += `import { cleanup } from '@testing-library/react';
`;
    if (!hasDebug)
      imports += `import { debug } from 'vitest-preview';
`;

    if (imports) {
      content = imports + content;
      console.log(chalk.dim('Added missing imports to setup file'));
    }

    // Add the hook
    const hook = `

// Added by vitest-preview automatic mode setup
beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    if (task?.result?.state === 'fail') {
      // Preview the failed test in the Vitest Preview Dashboard
      debug();
    }
    // Still perform cleanup, but after capturing the DOM state
    cleanup();
  });
});
`;

    content += hook;

    fs.writeFileSync(setupFilePath, content);
    console.log(`Added onTestFinished hook to ${chalk.green(setupFilePath)}`);
  } catch (error) {
    console.error(chalk.red(`Error modifying ${setupFilePath}:`), error);
  }
}

async function createSetupFile(filePath: string) {
  const content = `// Vitest setup file created by vitest-preview automatic mode setup
import { beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { debug } from 'vitest-preview';

beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    if (task?.result?.state === 'fail') {
      // Preview the failed test in the Vitest Preview Dashboard
      debug();
    }
    // Still perform cleanup, but after capturing the DOM state
    cleanup();
  });
});
`;

  fs.writeFileSync(filePath, content);
}

async function findOrCreateVitestUtils(isTypeScript = true) {
  const cwd = process.cwd();
  const fileExt = isTypeScript ? 'ts' : 'js';

  // Create paths with the correct extension first
  const possiblePaths = [
    path.join(cwd, 'src', 'utils', `vitest-utils.${fileExt}`),
    path.join(cwd, 'utils', `vitest-utils.${fileExt}`),
    path.join(cwd, 'test', 'utils', `vitest-utils.${fileExt}`),
  ];

  // Add paths with the other extension as fallback
  const otherExt = isTypeScript ? 'js' : 'ts';
  const fallbackPaths = [
    path.join(cwd, 'src', 'utils', `vitest-utils.${otherExt}`),
    path.join(cwd, 'utils', `vitest-utils.${otherExt}`),
    path.join(cwd, 'test', 'utils', `vitest-utils.${otherExt}`),
  ];

  // Combine paths, prioritizing the correct extension
  const allPaths = [...possiblePaths, ...fallbackPaths];

  // Check if any of the paths exist
  for (const utilsPath of allPaths) {
    if (fs.existsSync(utilsPath)) {
      console.log(
        `Found existing utils file at ${chalk.green(utilsPath)}. ${chalk.blue('Updating...')}`,
      );
      await updateVitestUtils(utilsPath);
      return utilsPath;
    }
  }

  // Create a new utils file
  const utilsDir = path.join(cwd, 'src', 'utils');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
    console.log(chalk.dim(`Created directory: ${utilsDir}`));
  }

  const utilsPath = path.join(utilsDir, `vitest-utils.${fileExt}`);
  await createVitestUtils(utilsPath, isTypeScript);
  console.log(`Created new utils file at ${chalk.green(utilsPath)}`);
  return utilsPath;
}

async function updateVitestUtils(filePath: string) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if the automatic debug fixture is already present
    if (
      content.includes('automaticDebugOnFail') &&
      content.includes('debug()')
    ) {
      console.log(
        chalk.yellow(
          `Automatic debug fixture already exists in ${filePath}. Skipping.`,
        ),
      );
      return;
    }

    // Check for existing imports
    const hasBaseTest =
      content.includes('baseTest') && content.includes("from 'vitest'");
    const hasDebug =
      content.includes('debug') && content.includes("from 'vitest-preview'");

    // Add missing imports
    let imports = '';
    if (!hasBaseTest)
      imports += `import { test as baseTest } from 'vitest';
`;
    if (!hasDebug)
      imports += `import { debug } from 'vitest-preview';
`;

    if (imports) {
      content = imports + content;
      console.log(chalk.dim('Added missing imports to utils file'));
    }

    // Add export * from 'vitest' if not present
    if (!content.includes(`export * from 'vitest'`)) {
      content += `\n\n// Added by vitest-preview automatic mode setup\nexport * from 'vitest';\n`;
      console.log(chalk.dim('Added vitest exports to utils file'));
    }

    // Add the fixture
    const fixture = `

// Added by vitest-preview automatic mode setup
const test = baseTest.extend({
  automaticDebugOnFail: [
    async ({ task }, use) => {
      await use(undefined);
      if (task.result?.state === 'fail') {
        debug();
      }
    },
    { auto: true }, // Make this fixture run automatically
  ],
});

const it = test;
export { test, it };
`;

    content += fixture;

    fs.writeFileSync(filePath, content);
    console.log(
      `Updated ${chalk.green(filePath)} with automatic debug fixture`,
    );
  } catch (error) {
    console.error(chalk.red(`Error updating ${filePath}:`), error);
  }
}

async function createVitestUtils(filePath: string, isTypeScript = true) {
  const fileType = isTypeScript ? 'ts' : 'js';
  const content = `// utils/vitest-utils.${fileType} - Created by vitest-preview automatic mode setup
import { test as baseTest } from 'vitest';
import { debug } from 'vitest-preview';

// You can re-export all exports from vitest
export * from 'vitest';

// Extend the test API with automatic debugging
const test = baseTest.extend({
  automaticDebugOnFail: [
    async ({ task }, use) => {
      await use(undefined);
      if (task.result?.state === 'fail') {
        debug();
      }
    },
    { auto: true }, // Make this fixture run automatically
  ],
});

const it = test;
export { test, it };
`;

  fs.writeFileSync(filePath, content);
}

async function createExampleTestFile(isTypeScript = true) {
  const cwd = process.cwd();
  const possibleDirs = [
    path.join(cwd, 'src', '__tests__'),
    path.join(cwd, 'tests'),
    path.join(cwd, 'test'),
    path.join(cwd, 'src', 'tests'),
    path.join(cwd, 'src', 'test'),
    path.join(cwd, 'src'),
  ];

  let targetDir = null;
  for (const dir of possibleDirs) {
    if (fs.existsSync(dir)) {
      targetDir = dir;
      console.log(chalk.dim(`Found test directory: ${dir}`));
      break;
    }
  }

  if (!targetDir) {
    targetDir = path.join(cwd, 'src');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(chalk.dim(`Created directory: ${targetDir}`));
    }
  }

  // Choose the appropriate file extension based on project type
  const fileExt = isTypeScript ? 'tsx' : 'jsx';
  const examplePath = path.join(targetDir, `example.test.${fileExt}`);

  if (fs.existsSync(examplePath)) {
    console.log(
      chalk.yellow(
        `Example test file already exists at ${examplePath}. Skipping creation.`,
      ),
    );
    console.log(
      `To use automatic debugging, import the test API from your vitest-utils file:`,
    );
    console.log(
      chalk.green(
        `import { test, describe, expect } from './utils/vitest-utils';`,
      ),
    );
    return;
  }

  const content = `// Example test file created by vitest-preview automatic mode setup
// IMPORT THE EXTENDED TEST API INSTEAD OF THE ONE FROM VITEST
import { test, describe, expect } from './utils/vitest-utils';
import { render, screen, userEvent } from '@testing-library/react';

// \`debug()\` will be called automatically if the test fails
test('should increment count on click', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button'));

  expect(await screen.findByText(/count is: 1/i)).toBeInTheDocument();
});
`;

  fs.writeFileSync(examplePath, content);
  console.log(`Created example test file at ${chalk.green(examplePath)}`);
  console.log(
    chalk.dim(
      'Note: You may need to adjust the example to match your application structure.',
    ),
  );
}
