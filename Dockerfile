FROM node:16

# Create app dir
RUN mkdir -p /user/src/app
WORKDIR /user/src/app

# Install deps
COPY package*.json .
RUN npm install

# Copy src files
COPY . .

# Build app
RUN npm run build
EXPOSE 8080

# Run app
CMD ["npm", "run", "dev"]
