# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["node", "app.js"]
