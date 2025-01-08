# Use Node.js LTS version as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/server

# Copy server-specific package files and install dependencies
COPY package*.json ./
RUN npm install --only=development

# Copy the rest of the server code
COPY . ./
# Pull database schema and generate Prisma client
RUN npm run prisma:pull
RUN npm run prisma:generate

# Compile TypeScript (if applicable)
RUN npm run build

# Expose the server's port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
