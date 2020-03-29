FROM node:10

WORKDIR /abzen

COPY . .

RUN yarn && yarn run build:admin

RUN mv dist/apps/admin-client public

EXPOSE 4000

ENTRYPOINT ["node", "dist/apps/admin-server/main.js"]