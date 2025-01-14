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
ARG DB_PASSWORD
ARG DB_DATABASE
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD
ARG PORT
ARG APP_KEY
ARG HOST
ARG LOG_LEVEL

# Passer les variables d'environnement au runtime
ENV SESSION_DRIVER=$SESSION_DRIVER \
    DB_HOST=$DB_HOST \
    DB_PORT=$DB_PORT \
    DB_USER=$DB_USER \
    DB_PASSWORD=$DB_PASSWORD \
    DB_DATABASE=$DB_DATABASE \
    REDIS_PASSWORD=$REDIS_PASSWORD \
    REDIS_HOST=$REDIS_HOST \
    REDIS_PORT=$REDIS_PORT \
    PORT=$PORT \
    APP_KEY=$APP_KEY \
    HOST=$HOST \
    LOG_LEVEL=$LOG_LEVEL

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

# Commande pour démarrer l'application et exécuter les migrations au runtime
CMD ["sh", "-c", "node ace migration:run --force && node bin/server.js"]
