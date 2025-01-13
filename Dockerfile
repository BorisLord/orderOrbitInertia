# Utilise l'image alpine de Node.js LTS
FROM node:lts-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires pour l'installation des dépendances
COPY package.json package-lock.json ./

# Installer les dépendances nécessaires pour le build
RUN npm install

# Copier le reste du code dans le conteneur
COPY . .

# Construire l'application
RUN npm run build

# Passer dans le répertoire build
WORKDIR /app/build

# Installer uniquement les dépendances de production dans le répertoire build
RUN npm ci --omit=dev

# Commande pour démarrer l'application
CMD ["node", "bin/server.js"]
