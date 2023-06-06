#!/bin/bash

temporal server start-dev > /dev/null & PID=$! && \
  sleep 1 && \
  npx ts-node ./src/develop.ts && \
  kill -INT $PID
