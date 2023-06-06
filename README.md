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

## Dev Kit for Integrations

### How to use:

#### First off, install Temporal globally for Typescript

```bash
brew install temporal

curl -sSf https://temporal.download/cli.sh | sh
```

Follow the promt to add the path variable to bash, you can copy the last line from that `curl` statement and put it in your terminal, something like:
`echo export PATH="\$PATH:/Users/{ENTER_YOUR_USER_DIRECTORY}/.temporalio/bin" >> ~/.bashrc`

#### Install temporal in python:

```bash
python3 -m venv env
```

```bash
source env/bin/activate
```

then

```bash
python -m pip install temporalio
```

### How to develop

There are two files you need to edit:
