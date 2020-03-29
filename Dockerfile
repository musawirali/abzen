FROM node:10

WORKDIR /abzen

COPY . .

RUN yarn && yarn run build:admin && yarn run build:serve

RUN mkdir public
RUN mv dist/apps/admin-client public/admin
RUN mv dist/apps/serve/abzen.js dist/apps/admin-server/assets/abzen.js

EXPOSE 4000

CMD ["node", "dist/apps/admin-server/main.js"]