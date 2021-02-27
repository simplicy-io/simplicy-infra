FROM node:latest
# Copy app
COPY . /home/craft/topup-service
WORKDIR /home/craft/
RUN cd topup-service \
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
WORKDIR /home/craft/topup-service
COPY --from=0 /home/craft/topup-service .

RUN chown -R craft:craft /home/craft

# set project directory
WORKDIR /home/craft/topup-service

# Expose port
EXPOSE 7700

USER craft

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
