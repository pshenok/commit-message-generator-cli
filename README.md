# Commit Message Generator CLI

A Node.js command-line interface (CLI) tool to generate commit messages using the GPT-4 API. This tool will analyze your uncommitted code changes and suggest 5 commit messages. You can select one of the suggested messages, and the tool will output a `git commit` command with the chosen message.

## Features

- Analyzes uncommitted code changes in your Git repository
- Generates 5 commit messages using the GPT API
- Allows you to select a commit message from the generated suggestions
- Outputs a `git commit` command with the chosen commit message

## Prerequisites

- Node.js >= 14.x.x
- An API key for GPT

## Installation & Usage

You don't need to install this package explicitly. You can run the tool using `npx`:

```
npx commit-message-generator-cli --gpt-api-key "your_api_key_here"
```

Create GPT API key her - https://platform.openai.com/account/api-keys

Replace `your_api_key_here` with your GPT API key.


The tool will analyze your uncommitted code changes and provide you with 5 suggested commit messages. Choose one of the messages, and the tool will output a `git commit` command with the chosen message.

Copy and paste the `git commit` command into your terminal to commit your changes with the selected commit message.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.



