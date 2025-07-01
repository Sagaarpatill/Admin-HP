# # Use a lightweight Node.js image as the base
# FROM node:20-alpine AS builder
# # Set the working directory inside the container to /app
# WORKDIR /app 

# # Copy package.json and yarn.lock (assuming you are consistently using yarn)
# COPY package.json ./
# COPY yarn.lock ./

# # Install dependencies
# RUN yarn install 

# # Copy the rest of your React application files (public/, src/, etc.)
# COPY . .

# # Build the React application for production
# RUN yarn run build

# # Use a lightweight Nginx image to serve the built React app
# FROM nginx:alpine

# # Copy the Nginx default configuration file
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Remove the default Nginx HTML files
# RUN rm -rf /usr/share/nginx/html/*

# # Copy the built React app from /app/build in the builder stage
# COPY --from=builder /app/build /usr/share/nginx/html

# # Expose port 80, the default HTTP port for Nginx
# EXPOSE 8080

# # Command to start Nginx when the container launches
# CMD ["nginx", "-g", "daemon off;"]
