# Use a lightweight Nginx image as the base
FROM nginx:alpine

# Copy your static website files into the Nginx default web root
# The '.' represents the current directory where the Dockerfile is located,
# and it expects your static website files (HTML, CSS, JS, images)
# to be in the same directory or a subdirectory.
COPY . /usr/share/nginx/html

# Expose port 8080, which is the default port Nginx listens on
EXPOSE 8080
