# Dockerfile - Beschreibt wie der Container gebaut wird

# Base Image: Node.js auf Alpine Linux (klein & schnell)
FROM node:18-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren (nur production)
RUN npm install --production

# Alle anderen Files kopieren
COPY . .

# Port exposieren (Cloud Run nutzt 8080)
EXPOSE 8080

# Server starten
CMD ["node", "server.js"]

