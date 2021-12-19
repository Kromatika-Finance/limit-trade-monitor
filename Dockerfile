FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

ENV NODE_ENV=production
ENV PORT "$PORT"
EXPOSE ${PORT:-3002}
CMD [ "npm", "run", "start" ]