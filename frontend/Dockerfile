# ============================================================
# ClipWave Frontend
# ============================================================

FROM nginx:1.27-alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy Nginx template
COPY nginx.conf.template /etc/nginx/default.conf.template

# Copy frontend files
COPY public/ /usr/share/nginx/html/

# Create startup script
#
# BACKEND_URL resolution:
#   - Local Docker Compose sets BACKEND_URL=http://backend:4000
#     -> the frontend proxies /api/ to the local backend container.
#   - Azure Container Apps does not set BACKEND_URL by default,
#     so this script falls back to the production Azure backend
#     URL below, preserving the existing production behaviour.
#     Override by setting BACKEND_URL on the frontend Container App
#     if the backend URL ever changes.
RUN printf '#!/bin/sh\n\
set -e\n\
DEFAULT_BACKEND_URL="https://streamhive-api.purplesky-dac4ff01.spaincentral.azurecontainerapps.io"\n\
BACKEND_URL="${BACKEND_URL:-$DEFAULT_BACKEND_URL}"\n\
BACKEND_HOST=$(echo "$BACKEND_URL" | sed -E "s~^[a-zA-Z]+://~~; s~/.*$~~")\n\
echo "=============================================="\n\
echo "Starting ClipWave Frontend"\n\
echo "=============================================="\n\
echo "BACKEND_URL=$BACKEND_URL"\n\
echo "BACKEND_HOST=$BACKEND_HOST"\n\
echo ""\n\
sed -e "s|BACKEND_URL_PLACEHOLDER|$BACKEND_URL|g" -e "s|BACKEND_HOST_PLACEHOLDER|$BACKEND_HOST|g" /etc/nginx/default.conf.template > /etc/nginx/conf.d/default.conf\n\
echo "Generated Nginx configuration:"\n\
cat /etc/nginx/conf.d/default.conf\n\
echo ""\n\
echo "Testing Nginx configuration..."\n\
nginx -t\n\
echo ""\n\
echo "Starting Nginx..."\n\
exec nginx -g "daemon off;"\n' > /docker-entrypoint-streamhive.sh \
    && chmod +x /docker-entrypoint-streamhive.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint-streamhive.sh"]