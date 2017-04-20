from phusion/baseimage:0.9.21

# Set up NodeJS repository
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && \
	apt-get install -y chromium-browser nodejs xvfb && \
	apt-get upgrade -y && \
	rm -rf /var/lib/apt/lists/*

# install yarn
ENV PATH="/root/.yarn/bin:${PATH}"
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN yarn global add karma-cli
RUN yarn

ENV CHROME_BIN=/usr/bin/chromium-browser

ENTRYPOINT ["/sbin/my_init", "--skip-startup-files", "--skip-runit", "--"]
