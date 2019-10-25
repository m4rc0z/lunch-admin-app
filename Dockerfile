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
ENV REACT_APP_AUTH_DOMAIN=XXX
ENV REACT_APP_AUTH_CLIENT_ID=XXX
ENV REACT_APP_AUTH_AUDIENCE=XXX
ENV REACT_APP_AUTH_CONTAINER=XXX
ENV REACT_APP_CALLBACK_URL=XXX
ENV REACT_APP_BACKEND_URL=XXX
##########################################################################################################################################

# PROD build
RUN npm run build

# the production environment
FROM nginx:1.17.5-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]