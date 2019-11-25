FROM node:12.13.0-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package-lock.json package.json ./
RUN npm install --production

COPY src ./src
COPY public ./public

ARG auth_domain=lunchmenuapp.eu.auth0.com
ARG auth_client_id=j2Rh6xocwsiF1IgxvEbfO9wluxidocEX
ARG auth_audience=https://lunchmenuapp/api
ARG auth_container=auth0-login-container
ARG callback_url=https://dev.mealit.de/callback
ARG backend_url=https://dev.mealit.de
##########################################################################################################################################
# see https://medium.com/free-code-camp/how-to-implement-runtime-environment-variables-with-create-react-app-docker-and-nginx-7f9d42a91d70
##########################################################################################################################################
ENV REACT_APP_AUTH_DOMAIN=${auth_domain}
ENV REACT_APP_AUTH_CLIENT_ID=${auth_client_id}
ENV REACT_APP_AUTH_AUDIENCE=${auth_audience}
ENV REACT_APP_AUTH_CONTAINER=${auth_container}
ENV REACT_APP_CALLBACK_URL=${callback_url}
ENV REACT_APP_BACKEND_URL=${backend_url}
##########################################################################################################################################

# PROD build
RUN npm run build

# the production environment
FROM nginx:1.17.5-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]