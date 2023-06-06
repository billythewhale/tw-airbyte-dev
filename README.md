# TW Airbyte + Temporal Dev Kit

WIP

# Dev Kit for Integrations

## How to use:

### First off, install Temporal globally for Typescript

```
brew install temporal

curl -sSf https://temporal.download/cli.sh | sh
```

Follow the promt to add the path variable to bash, you can copy the last line from that `curl` statement and put it in your terminal, something like:
`echo export PATH="\$PATH:/Users/{ENTER_YOUR_USER_DIRECTORY}/.temporalio/bin" >> ~/.bashrc`

### Install temporal in python:

```
python3 -m venv env
```

```
source env/bin/activate
```

then

```
python -m pip install temporalio
```

## How to develop

There are two files you need to edit:
