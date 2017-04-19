from phusion/baseimage:0.9.21

# Set up NodeJS repository
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
ENV CHROME_BIN=/usr/bin/chromium
RUN apt-get update && \
	apt-get install -y chromium nodejs && \
	apt-get upgrade && \
	rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/sbin/my_init", "--skip-startup-files", "--skip-runit", "--"]
