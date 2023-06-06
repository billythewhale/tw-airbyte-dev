#!/bin/bash

temporal server start-dev > /dev/null & \
  ts-node ./src/develop.ts
