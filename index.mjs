import inquirer from 'inquirer';
import { Configuration, OpenAIApi } from 'openai';
import simpleGit from 'simple-git';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import boxen from 'boxen';

const commitTypes = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'test',
  'chore',
  'ci',
  'build',
  'perf',
];

const git = simpleGit();

const argv = yargs(hideBin(process.argv))
  .option('gpt-api-key', {
    alias: 'k',
    description: 'Your GPT-4 API key',
    type: 'string',
  })
  .demandOption('gpt-api-key', 'Please provide a GPT API key')
  .help()
  .alias('help', 'h').argv;

const gptClient = new OpenAIApi(new Configuration({
  apiKey: argv['gpt-api-key'],
}))

async function getUncommittedChanges() {
  const status = await git.status();
  const modifiedFiles = status.modified.map((file) => `Modified: ${file}`).join('\n');
  const newFiles = status.not_added.map((file) => `New: ${file}`).join('\n');
  return `${modifiedFiles}\n${newFiles}`;
}

async function generateCommitMessages(prefix) {
  const prompt = `
  
  Do not use swear marks.
  Do not use "Added new files..."
  Use lowercase.
  Try to desribe code changes in a way that is easy to understand.
  Generate a commit message for the following code changes for my commit '${prefix}'`;
  const codeChanges = await getUncommittedChanges();

  const result = await gptClient.createCompletion({
    model: "text-davinci-003",
    prompt: `${prompt}\n${codeChanges}\nCommit message: `,
    max_tokens: 25,
    n: 5,
    stop: null,
    temperature: 1,
  });

  return result.data.choices.map((choice) => choice.text.trim());
}

async function main() {
  const { commitType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'commitType',
      message: 'Select a commit type:',
      choices: commitTypes,
    },
  ]);

  const { commitScope } = await inquirer.prompt([
    {
      type: 'input',
      name: 'commitScope',
      message: 'Enter an optional commit scope (press enter to skip):',
    },
  ]);

  const commitPrefix = commitScope
    ? `${commitType}(${commitScope}):`
    : `${commitType}:`;

  const commitMessages = await generateCommitMessages(commitPrefix);

  const { selectedMessage } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedMessage',
      message: 'Select a commit description:',
      choices: commitMessages,
    },
  ]);

  if (!commitScope) commitPrefix.replace('()', '');

  const commitCommand = `git commit -m "${selectedMessage}"`;

  console.log('\nTo commit your changes, run the following command:')
  console.log(
    boxen(
      chalk.yellow(`git add .\n${commitCommand}`), {
      padding: 1,
      borderColor: 'blue',
      margin: 1,
    })
  );
}

main();
