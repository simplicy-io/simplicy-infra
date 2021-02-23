FROM node:latest
# Copy app
COPY . /home/craft/blockchain-client
WORKDIR /home/craft/
RUN cd blockchain-client \
    && npm install \
    && npm run build \
    && rm -fr node_modules \
    && npm install --only=production

FROM node:slim
# Install dependencies
RUN apt-get update \
    && apt-get install -y gettext-base \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setup docker-entrypoint
COPY docker/docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh
RUN ln -s usr/local/bin/docker-entrypoint.sh / # backwards compat

# Add non root user
RUN useradd -ms /bin/bash craft
WORKDIR /home/craft/blockchain-client
COPY --from=0 /home/craft/blockchain-client .

RUN chown -R craft:craft /home/craft

# set project directory
WORKDIR /home/craft/blockchain-client

# Expose port
EXPOSE 8000

USER craft

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
