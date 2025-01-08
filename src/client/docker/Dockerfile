FROM node:18-alpine

WORKDIR /usr/src/client

COPY package*.json ./
RUN npm install --only=development

COPY . ./

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start"]
