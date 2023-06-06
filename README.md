# TW Airbyte + Temporal Dev Kit

This repository is a dev kit for building Airbyte connectors using Temporal.

## Prerequisites

Ensure you have these installed on your machine before continuing:

- [Brew](https://brew.sh/)
- [Node](https://nodejs.org/en/download/)
- [VSCode](https://code.visualstudio.com/download)
- [VSCode Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Python](https://www.python.org/downloads/)
- [PIP](https://pip.pypa.io/en/stable/installation/)

Recommended to have:

- [Github Copilot](https://copilot.github.com/)

## Access

You should not need access to any additional services to develop this connector, only this repository.

If your connector will require API keys, and they will be provided for you, and you should put them in the `mocks/IntegrationsServices.ts` file.

### Install Temporal globally for Typescript

```bash
brew install temporal

curl -sSf https://temporal.download/cli.sh | sh
```

Follow the prompt to add the path variable to bash, you can copy the last line from that `curl` statement and put it in your terminal, something like:
`echo export PATH="\$PATH:/Users/{ENTER_YOUR_USER_DIRECTORY}/.temporalio/bin" >> ~/.bashrc`

#### Install temporal in Python

```bash
python3 -m venv env
```

```bash
source env/bin/activate
```

```bash
python -m pip install temporalio
```

### How to Develop

There are two files you need to edit:

WIP
