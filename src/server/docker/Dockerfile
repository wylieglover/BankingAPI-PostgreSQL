FROM node:20 AS builder
WORKDIR /usr/src/server

COPY package*.json ./
ENV NODE_ENV=development
RUN npm install

COPY prisma ./prisma
COPY . ./

RUN npm run prisma:pull
RUN npm run prisma:generate
RUN npm run build 

# --- Production image ---
FROM node:20 AS production
WORKDIR /usr/src/server

COPY package*.json ./
ENV NODE_ENV=production
RUN npm install --omit=dev

COPY --from=builder /usr/src/server/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /usr/src/server/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /usr/src/server/dist ./dist
COPY --from=builder /usr/src/server/prisma ./prisma

CMD ["npm", "start"]
