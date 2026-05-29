FROM node:20-alpine 

WORKDIR /app

COPY backend/package*.json /app/

RUN npm ci --omit=dev 

COPY backend/ .

EXPOSE 3000

CMD ["npm", "start"]