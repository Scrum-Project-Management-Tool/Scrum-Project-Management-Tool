# Dockerfile for Express Backend
FROM node:20

# Set the working directory
WORKDIR /app

# Copy all of the application
COPY . .    

# Install all dependencies specified in package.json
RUN npm install

# Expose the API port
EXPOSE 8000

# Start the application
CMD ["npm", "run" , "dev"]
