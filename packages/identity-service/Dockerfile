FROM node:latest
# Copy app
COPY . /home/craft/identity-service
WORKDIR /home/craft/
RUN cd identity-service \
    && npm install \
    && npm run build \
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
WORKDIR /home/craft/identity-service
COPY --from=0 /home/craft/identity-service .

RUN chown -R craft:craft /home/craft

# set project directory
WORKDIR /home/craft/identity-service

# Expose port
EXPOSE 8100

USER craft

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
