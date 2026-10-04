# Image du site — docs/devops.md section 3. Construction depuis la racine du dépôt :
#   docker build -f docker/Dockerfile -t kibreeze-web:dev .
# Les exclusions sont dans docker/Dockerfile.dockerignore, lu par BuildKit à côté de ce fichier.

# --- Étape 1 : construction du site statique -------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Les dépendances d'abord : tant que package*.json ne change pas, cette couche reste en cache.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .

# Variables de construction, pas d'exécution : elles finissent dans le HTML généré.
# Absentes, la construction prend le repli documenté dans config/resolve-env.mjs.
ARG PUBLIC_WHATSAPP_NUMBER
ARG PUBLIC_SITE_URL
ENV PUBLIC_WHATSAPP_NUMBER=$PUBLIC_WHATSAPP_NUMBER \
    PUBLIC_SITE_URL=$PUBLIC_SITE_URL

RUN npm run build

# --- Étape 2 : service par nginx, sans Node ---------------------------------
FROM nginx:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Utilisateur non privilégié : il doit pouvoir écrire le cache et les fichiers temporaires.
RUN chown -R nginx:nginx /var/cache/nginx /usr/share/nginx/html

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
