#!/bin/bash

temporal server start-dev > /dev/null & \
  npx ts-node ./src/develop.ts
