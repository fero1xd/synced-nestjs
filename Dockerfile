FROM node:16
RUN mkdir /root/codes


WORKDIR /root/server/
COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3001
CMD [ "yarn", "start:prod" ]