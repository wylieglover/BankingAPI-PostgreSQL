ARG SERVER_IMAGE=myserver:latest

FROM ${SERVER_IMAGE} AS serverartifacts

FROM node:20 AS clientbuilder
WORKDIR /usr/src/client

COPY package*.json ./
RUN npm install

RUN npm uninstall @prisma/client
COPY --from=serverartifacts /usr/src/server/node_modules/.prisma/client /usr/src/client/node_modules/.prisma/client
COPY --from=serverartifacts /usr/src/server/prisma /usr/src/client/prisma
RUN npm install @prisma/client

COPY . ./

RUN npm run build

FROM node:20 AS clientproduction
WORKDIR /usr/src/client

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=clientbuilder /usr/src/client/.next ./.next
COPY --from=clientbuilder /usr/src/client/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=clientbuilder /usr/src/client/prisma ./prisma

CMD ["npm", "start"]
