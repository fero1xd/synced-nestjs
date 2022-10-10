FROM node:16
RUN mkdir /root/codes


WORKDIR /root/server/
COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start:prod" ]