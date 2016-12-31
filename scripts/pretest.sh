#!/usr/bin/env bash

# clean
if [ -d build/dist/ ]; then
	rm -r build/dist/
fi

gulp dist
