FROM node:10.16.0
EXPOSE 80

WORKDIR /usr/src/ownzones_challenge
CMD yarn install --prod && yarn run start:prod


