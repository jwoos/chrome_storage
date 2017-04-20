#!/usr/bin/env bash

if [[ $1 == 'docker' ]]; then
	docker run -it --rm \
		-v "$PWD":/usr/src/app \
		-w /usr/src/app \
		jwoos/chrome_storage xvfb-run ./node_modules/karma/bin/karma start karma.conf.js
elif [[ $1 == 'xvfb' ]]; then
	xvfb-run karma start karma.conf.js
else
	karma start karma.conf.js
fi
