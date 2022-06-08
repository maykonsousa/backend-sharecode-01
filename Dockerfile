FROM node
WORKDIR /usr/app
COPY package.json ./
COPY package.json ./
COPY .env ./
COPY tsconfig.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
EXPOSE 3333
CMD ["npm", "run", "dev"]

