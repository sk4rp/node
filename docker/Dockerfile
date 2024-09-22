FROM node:latest

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY src ./src

EXPOSE 4000

CMD ["npm", "start"]
