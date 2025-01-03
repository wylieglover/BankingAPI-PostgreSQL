FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . ./

# Pull database schema and generate Prisma client
RUN npx prisma db pull
RUN npx prisma generate

# Compile TypeScript
RUN npx tsc

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "start"]