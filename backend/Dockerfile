# # Use a Node.js image as the base
# FROM node:20-alpine

# # Install bash
# RUN apk add --no-cache bash
# # Set the working directory to the app root inside the container
# WORKDIR /app

# # Set the environment variable to production
# ENV NODE_ENV=production

# # Copy package.json and package-lock.json
# # These paths are now relative to the build context (which is ADMINHP/backend/)
# # and are copied to the WORKDIR (/app) inside the container.
# COPY package.json ./
# COPY package-lock.json ./
# COPY wait-for-it.sh ./
# RUN chmod +x wait-for-it.sh 
# # or yarn.lock if you are doing yarn install. Ensure consistency.

# # Install dependencies
# RUN yarn install 

# # Copy the rest of your application code
# COPY . .

# # Expose the port your backend listens on (e.g., 5000 or 3001)
# # EXPOSE 8080
# EXPOSE 5000

# # Command to start your backend server
# # Assuming your main server file is backend/server.js on host, it will be /app/server.js in container
# CMD ["node", "server.js"] 



