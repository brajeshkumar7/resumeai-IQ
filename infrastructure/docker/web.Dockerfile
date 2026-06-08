FROM node:22-slim

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY apps/frontend/package.json /app/apps/frontend/package.json
COPY packages/shared/package.json /app/packages/shared/package.json
RUN npm install

COPY . /app

WORKDIR /app/apps/frontend
RUN npm run build

CMD ["npm", "run", "start"]
