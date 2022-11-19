FROM node:lts as builder

WORKDIR /app

COPY  package.json yarn.lock /app/

RUN yarn

COPY . /app/

RUN yarn prisma generate
RUN yarn tsc

FROM node:lts as release

WORKDIR /app

COPY --from=builder /app/dist /app/package.json /app/yarn.lock /app/prisma/schema.prisma /app/
ENV NODE_ENV=production
ENV DATABASE_URL=env(DATABASE_URL)

RUN yarn && yarn prisma generate

USER node

EXPOSE 8080

CMD ["node","index.js"]