# Version of the dev image to be used (ensures all developers use same version)
FROM node:22-alpine
# Change the working directory to /app inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy all the files to the container
COPY . .
# Exposes the application port for host machine to communicate.
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Start the application
CMD [ "npm", "run", "dev" ]
