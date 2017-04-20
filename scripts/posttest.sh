#!/usr/bin/env bash

if [[ $1 == 'docker' ]]; then
	docker run -it --rm \
		-v "$PWD":/usr/src/app \
		-w /usr/src/app \
		-e "COVERALLS_REPO_TOKEN=${COVERALLS_REPO_TOKEN}" \
		-e "TRAVIS=${TRAVIS}" \
		-e "TRAVIS_JOB_ID=${TRAVIS_JOB_ID}" \
		jwoos/chrome_storage bash -c 'cat coverage/lcov/lcov.info | ./node_modules/coveralls/bin/coveralls.js'
else
	cat ./coverage/lcov/lcov.info | ./node_modules/coveralls/bin/coveralls.js -v
fi
