#!/usr/bin/env bash

cat ./coverage/lcov/lcov.info
cat ./coverage/lcov/lcov.info | ./node_modules/coveralls/bin/coveralls.js -v
