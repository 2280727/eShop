FROM node:18-alpine
WORKDIR /app
COPY package.json /app
RUN npm install --legacy-peer-deps
COPY . /app
EXPOSE 3000
CMD ["node", "app.js"]