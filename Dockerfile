FROM node:23-alpine3.20
WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

ENV SERVER_URL http://localhost:5000

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]