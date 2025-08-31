# Use official Node.js image as the base
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
RUN apt-get update && apt-get install -y build-essential python3
COPY package*.json ./
RUN npm install
RUN npm rebuild lightningcss --force

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
