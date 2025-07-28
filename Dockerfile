# Step 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Step 2: Serve static build with nginx
FROM nginx:alpine
# If Vanilla React : 
# COPY --from=builder /app/build /usr/share/nginx/html
# If Vite : 
COPY --from=builder /app/dist /usr/share/nginx/html

# do not change this
EXPOSE 80 