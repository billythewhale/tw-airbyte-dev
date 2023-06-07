#!/bin/bash

temporal server start-dev > /dev/null & TEMPORAL_SERVER_PID=$!
npx ts-node ./src/develop.ts
kill -INT $TEMPORAL_SERVER_PID
