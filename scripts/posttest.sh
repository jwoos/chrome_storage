#!/usr/bin/env bash

cat ./coverage/lcov/lcov.info > ./coverage/lcov-own.info
cat ./coverage/lcov-own.info | ./node_modules/coveralls/bin/coveralls.js -v
