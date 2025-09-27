import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadConfigFromFile } from 'vite';

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

export async function setupAutomaticMode() {
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
      chalk.red(
        'You may need to manually configure your test setup. Visit https://vitest-preview.com/guide/automatic-mode for more information.',
      ),
    );
  }

  // Step 2: Add onTestFinished hook
  console.log(`\n${chalk.bold('Step 2:')} Adding the onTestFinished Hook`);

  // Determine if project is TypeScript or JavaScript
  const isTs = await isTypeScriptProject();
  const fileExt = isTs ? 'ts' : 'js';

  // Create paths for setup file
  const cwd = process.cwd();
  const setupDir = path.join(cwd, 'src', 'test');
  const setupFilePath = path.join(setupDir, `setup.${fileExt}`);

  // Check if we have a setup file in the config
  let configSetupFile = null;
  if (
    vitestConfig &&
    vitestConfig.setupFiles &&
    vitestConfig.setupFiles.length > 0
  ) {
    configSetupFile = vitestConfig.setupFiles[0];
    await addOnTestFinishedHook(configSetupFile);
  } else {
    // Create the setup directory if it doesn't exist
    if (!fs.existsSync(setupDir)) {
      fs.mkdirSync(setupDir, { recursive: true });
      console.log(chalk.dim(`Created directory: ${setupDir}`));
    }

    // Create or update the setup file
    await createOrUpdateSetupFile(setupFilePath);
    console.log(`Created a new setup file at ${chalk.green(setupFilePath)}`);

    // Update the Vitest config to include the setup file
    if (vitestConfig) {
      await updateVitestConfig(vitestConfig.path, setupFilePath);
    } else {
      console.log(
        chalk.yellow(
          `Make sure to add this file to your Vitest configuration's setupFiles array:`,
        ),
      );
      console.log(chalk.green(`setupFiles: './src/test/setup.${fileExt}'`));
      console.log(
        'Visit https://vitest-preview.com/guide/automatic-mode for a detailed guide.',
      );
    }
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
        const extractedConfig = await loadConfigFromFile(
          { command: 'serve', mode: 'test' },
          configPath,
        );
        let setupFiles = extractedConfig?.config.test?.setupFiles;
        setupFiles = !setupFiles
          ? undefined
          : Array.isArray(setupFiles)
            ? setupFiles
            : [setupFiles];
        highestPriorityConfig = {
          path: configPath,
          setupFiles,
        };
        highestPriority = config.priority;
      } catch (error) {
        console.error(`Error reading ${config.name}:`, error);
      }
    }
  }

  return highestPriorityConfig;
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

async function updateVitestConfig(configPath: string, setupFilePath: string) {
  try {
    let content = fs.readFileSync(configPath, 'utf-8');
    const relativePath = path
      .relative(path.dirname(configPath), setupFilePath)
      .replace(/\\/g, '/') // Convert Windows backslashes to forward slashes
      .replace(/^(?!\.\.\/)/, './'); // Ensure path starts with ./ if it's not a parent directory

    // Check if setupFiles already exists
    const setupFilesRegex =
      /^(?!\s*\/\/)\s*setupFiles\s*:\s*(\[[^\]]*\]|['"](.*?)['"])/;
    const setupFilesMatch = content.match(setupFilesRegex);

    if (setupFilesMatch) {
      // If setupFiles is an array
      if (setupFilesMatch[1].startsWith('[')) {
        // Check if our setup file is already in the array
        const setupFilesArray = setupFilesMatch[1];
        if (!setupFilesArray.includes(relativePath)) {
          // Add our setup file to the array
          const newSetupFilesArray = setupFilesArray.replace(
            /\[/,
            `[\n    '${relativePath}',`,
          );
          content = content.replace(setupFilesArray, newSetupFilesArray);
        }
      } else {
        // If setupFiles is a string, convert it to an array with our setup file
        const existingPath = setupFilesMatch[2];
        if (existingPath !== relativePath) {
          const newSetupFiles = `setupFiles: [\n    '${existingPath}',\n    '${relativePath}'\n  ]`;
          content = content.replace(setupFilesRegex, newSetupFiles);
        }
      }
    } else {
      // If setupFiles doesn't exist, add it
      const testConfigRegex = /(test\s*:\s*{)/;
      if (testConfigRegex.test(content)) {
        content = content.replace(
          testConfigRegex,
          `$1\n    setupFiles: '${relativePath}',`,
        );
      } else {
        // If there's no test config, we need to add it
        console.log(
          chalk.yellow(`Could not find test configuration in ${configPath}.`),
        );
        console.log(
          chalk.yellow(
            `Please manually add the setup file to your configuration:`,
          ),
        );
        console.log(chalk.green(`test: {\n  setupFiles: '${relativePath}'\n}`));
        return;
      }
    }

    fs.writeFileSync(configPath, content);
    console.log(
      `Updated ${chalk.green(configPath)} with setup file: ${chalk.cyan(relativePath)}`,
    );
  } catch (error) {
    console.error(chalk.red(`Error updating ${configPath}:`), error);
    console.log(
      chalk.yellow(`Please manually add the setup file to your configuration.`),
    );
  }
}

async function findAndDisableCleanup(setupFiles?: string[]) {
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
    // Create the directory if it doesn't exist
    const setupDir = path.dirname(setupFilePath);
    if (!fs.existsSync(setupDir)) {
      fs.mkdirSync(setupDir, { recursive: true });
      console.log(chalk.dim(`Created directory: ${setupDir}`));
    }

    // Create the file if it doesn't exist
    if (!fs.existsSync(setupFilePath)) {
      await createOrUpdateSetupFile(setupFilePath);
      console.log(`Created new setup file at ${chalk.green(setupFilePath)}`);
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
    const hasTestingLibraryJestDom = content.includes(
      "from '@testing-library/jest-dom'",
    );

    // Prepare imports to add at the top of the file
    let importsToAdd = [];
    if (!hasBeforeEach)
      importsToAdd.push("import { beforeEach } from 'vitest';");
    if (!hasCleanup)
      importsToAdd.push("import { cleanup } from '@testing-library/react';");
    if (!hasDebug) importsToAdd.push("import { debug } from 'vitest-preview';");
    if (!hasTestingLibraryJestDom)
      importsToAdd.push("import '@testing-library/jest-dom';");

    // Add imports if needed
    if (importsToAdd.length > 0) {
      // Find the last import statement to add our imports after it
      const importRegex = /import\s+.*?['"].*?['"];?\s*$/gm;
      const matches = [...content.matchAll(importRegex)];

      if (matches.length > 0) {
        // Get the last import statement
        const lastImport = matches[matches.length - 1];
        const lastImportIndex = lastImport.index + lastImport[0].length;

        // Insert our imports after the last import
        content =
          content.slice(0, lastImportIndex) +
          '\n' +
          importsToAdd.join('\n') +
          '\n' +
          content.slice(lastImportIndex);
      } else {
        // No imports found, add at the beginning of the file
        content = importsToAdd.join('\n') + '\n\n' + content;
      }

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

async function createOrUpdateSetupFile(filePath: string) {
  let content = `// Vitest setup file created by vitest-preview automatic mode setup
import { beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { debug } from 'vitest-preview';

/**
 * This setup file configures Vitest Preview to automatically capture the DOM state
 * when a test fails, without requiring manual debug() calls in each test.
 * 
 * It uses the onTestFinished hook to detect test failures and calls debug() before cleanup.
 * This ensures that the DOM state is preserved for debugging in the Vitest Preview dashboard.
 */
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

  // Create the directory if it doesn't exist
  const setupDir = path.dirname(filePath);
  if (!fs.existsSync(setupDir)) {
    fs.mkdirSync(setupDir, { recursive: true });
  }

  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf-8') + `\n` + content;
  }

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
