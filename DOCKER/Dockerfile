FROM node:18-alpine

WORKDIR /app   # ✅ clean and standard

COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
