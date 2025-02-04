FROM node:23-alpine3.20
WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

ENV SERVER_URL http://localhost:5000

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]