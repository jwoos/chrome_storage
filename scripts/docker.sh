#!/usr/bin/env bash

if [[ $1 == 'build' ]]; then
	docker build -t jwoos/chrome_storage .
elif [[ $1 == 'push' ]]; then
	docker push jwoos/chrome_storage
else
	docker build -t jwoos/chrome_storage .
	docker push jwoos/chrome_storage
fi
