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
CMD ["sh", "-c", "node ace migration:run --force; sleep 2; node bin/server.js"]



# root@vmi2397969:~# docker ps
# CONTAINER ID   IMAGE                                                               COMMAND                  CREATED         STATUS                  PORTS                                                                                                                                                        NAMES
# 31238f492393   q40gcg4cscskksw8swkkgows:3bf92d4cb132040fd5795251077b92cfea2d0abb   "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes            3333/tcp                                                                                                                                                     q40gcg4cscskksw8swkkgows-022627747986
# bc1cbc699b13   nginx:stable-alpine                                                 "/docker-entrypoint.…"   2 hours ago     Up 2 hours (healthy)    80/tcp, 0.0.0.0:5432->5432/tcp, :::5432->5432/tcp                                                                                                            loo08s0skkg04wsk84488sos-proxy
# f4eeaafd347b   postgres:16-alpine                                                  "docker-entrypoint.s…"   2 hours ago     Up 2 hours (healthy)    5432/tcp                                                                                                                                                     loo08s0skkg04wsk84488sos
# b48523a052d3   traefik:v3.1                                                        "/entrypoint.sh --pi…"   6 hours ago     Up 6 hours (healthy)    0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp, 0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 0.0.0.0:443->443/udp, :::443->443/udp   coolify-proxy
# 6ec6d1e79a86   shlinkio/shlink-web-client                                          "/docker-entrypoint.…"   7 hours ago     Up 7 hours (healthy)    8080/tcp                                                                                                                                                     shlink-web-z8ccwoc88o04gggs0scsgc0c
# 788a61548397   ghcr.io/coollabsio/sentinel:0.0.15                                  "/app/sentinel"          7 hours ago     Up 3 hours (healthy)                                                                                                                                                                 coolify-sentinel
# e48d40f919e5   louislam/uptime-kuma:1                                              "/usr/bin/dumb-init …"   10 hours ago    Up 10 hours (healthy)   3001/tcp                                                                                                                                                     uptime-kuma-hww4kwwos84soksws04gg8kk
# ebbeafd3e25b   redis:7.2                                                           "docker-entrypoint.s…"   12 hours ago    Up 12 hours (healthy)   6379/tcp                                                                                                                                                     qc0ko8s0o8owoo88c8s8gwks
# 18d5e2181675   jggcso0gkkkg8oksgc8ws0ck:6e88ffb89a2498362e92c55e8de4167a9423a4c5   "/docker-entrypoint.…"   26 hours ago    Up 26 hours (healthy)   80/tcp                                                                                                                                                       jggcso0gkkkg8oksgc8ws0ck-001251287040
# e568050c929e   ghcr.io/coollabsio/coolify:4.0.0-beta.380                           "docker-php-serversi…"   27 hours ago    Up 27 hours (healthy)   8000/tcp, 8443/tcp, 9000/tcp, 0.0.0.0:8000->8080/tcp, :::8000->8080/tcp                                                                                      coolify
# 1942ad0b1cf6   ghcr.io/coollabsio/coolify-realtime:1.0.5                           "/bin/sh /soketi-ent…"   27 hours ago    Up 27 hours (healthy)   0.0.0.0:6001-6002->6001-6002/tcp, :::6001-6002->6001-6002/tcp                                                                                                coolify-realtime
# 45b59762b191   redis:7-alpine                                                      "docker-entrypoint.s…"   27 hours ago    Up 27 hours (healthy)   6379/tcp                                                                                                                                                     coolify-redis
# 66585ff664bc   postgres:15-alpine                                                  "docker-entrypoint.s…"   27 hours ago    Up 27 hours (healthy)   5432/tcp                                                                                                                                                     coolify-db
# root@vmi2397969:~# 