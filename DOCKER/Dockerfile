FROM node:18-alpine

# Create app directory
WORKDIR ./src

# Install app dependencies (use package-lock if present)
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Bundle app source
COPY . .

ENV NODE_ENV=production

# Let the platform (Render) provide the port via PORT env var
EXPOSE 5000

CMD ["npm", "start"]
