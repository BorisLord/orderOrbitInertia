# Utilise l'image alpine de Node.js LTS
FROM node:lts-alpine

# Installer curl
RUN apk add --no-cache curl

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires pour l'installation des dépendances
COPY package.json package-lock.json ./

# Définir les variables d'environnement nécessaires au build
ARG SESSION_DRIVER
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_DATABASE
ARG REDIS_HOST
ARG REDIS_PORT

# Passer les variables d'environnement au runtime
ENV SESSION_DRIVER=$SESSION_DRIVER \
    DB_HOST=$DB_HOST \
    DB_PORT=$DB_PORT \
    DB_USER=$DB_USER \
    DB_DATABASE=$DB_DATABASE \
    REDIS_HOST=$REDIS_HOST \
    REDIS_PORT=$REDIS_PORT

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

# Exposer le port utilisé par l'application
EXPOSE 3333

# Définir NODE_ENV pour l'exécution
ENV NODE_ENV=production

# Exécuter les migrations
RUN node ace migration:run --force

# Démarrer l'application
CMD ["node", "bin/server.js"]
