# Step 1: Use an official Node.js image as the base image
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files to the working directory
COPY . .

# Step 6: Expose the port your application runs on (default 5000 for your app)
EXPOSE 5000

# Step 7: Set the environment variable for the MongoDB connection (optional for flexibility)
ENV MONGO_URI=mongodb://mongo:27017/plancake

# Step 8: Define the command to run your application
CMD ["npm", "start"]
