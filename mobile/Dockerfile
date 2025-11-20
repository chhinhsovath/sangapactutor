FROM node:18-alpine

# Install dependencies for React Native
RUN apk add --no-cache \
    bash \
    curl \
    git \
    openssh \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Install watchman
RUN npm install -g watchman

# Install additional packages for file watching
RUN npm install -g metro-react-native-babel-transformer @babel/core

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy the rest of the application
COPY . .

# Create .expo directory
RUN mkdir -p .expo

# Expo CLI needs to bind to all interfaces to be accessible from outside the container
EXPOSE 8081

# The command to start the application will be specified in docker-compose.yml
CMD ["sh", "-c", "npx expo start --dev-client"]