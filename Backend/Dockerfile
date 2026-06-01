FROM node:lts-alpines

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "/sin/sh", "/usr/local/bin/docker-entrypoint.sh" ]

CMD [ "node", "server.js" ]

EXPOSE 3443