FROM node:12.13.0-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package-lock.json package.json ./
RUN npm install --production

COPY src ./src
COPY public ./public

##########################################################################################################################################
# see https://medium.com/free-code-camp/how-to-implement-runtime-environment-variables-with-create-react-app-docker-and-nginx-7f9d42a91d70
##########################################################################################################################################
ENV REACT_APP_AUTH_DOMAIN=lunchmenuapp.eu.auth0.com
ENV REACT_APP_AUTH_CLIENT_ID=j2Rh6xocwsiF1IgxvEbfO9wluxidocEX
ENV REACT_APP_AUTH_AUDIENCE=https://lunchmenuapp/api
ENV REACT_APP_AUTH_CONTAINER=auth0-login-container
ENV REACT_APP_CALLBACK_URL=https://dev.mealit.de/callback
ENV REACT_APP_BACKEND_URL=https://dev.mealit.de
##########################################################################################################################################

# PROD build
RUN npm run build

# the production environment
FROM nginx:1.17.5-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]