# Use the Node.js LTS version as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY ../package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY ../ ./

# Pull database schema and generate Prisma client
RUN npm run prisma:pull
RUN npm run prisma:generate

# Compile TypeScript
RUN npm run build

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3001

# Run the application
CMD ["npm", "start"]