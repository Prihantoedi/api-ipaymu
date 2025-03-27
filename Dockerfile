# use node js as base image

FROM node:20.16.0-alpine


#Set working direcotry in container
WORKDIR /app

# Copy all files into container
COPY . .

# Install dependencies
RUN npm install
RUN npm install express
RUN npm install dotenv
RUN npm install node-fetch
RUN npm install crypto-js
RUN npm install multer

# Expose port for apps
EXPOSE 3000

# Run apps

CMD ["node", "app.js"]

