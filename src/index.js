const {ApolloServer} = require('apollo-server-express');
const express = require('express');
const {createServer} = require('http');
const {execute, subscribe} = require('graphql');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const {makeExecutableSchema} = require('@graphql-tools/schema');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const SECRET_KEY = 'testing123123';

const getUserFromToken = (token) => {
    if (token) {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (err) {
            throw new Error('Неверный токен');
        }
    }
    return null;
};

const app = express();

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const server = new ApolloServer({
    schema,
    context: ({req}) => {
        const token = req.headers.authorization || '';
        const user = getUserFromToken(token.replace('Bearer ', ''));
        return {user};
    },
});

server.start().then(() => {
    server.applyMiddleware({app});

    const httpServer = createServer(app);

    new SubscriptionServer(
        {
            execute,
            subscribe,
            schema,
            onConnect: (connectionParams) => {
                if (connectionParams.authorization) {
                    const user = getUserFromToken(connectionParams.authorization);
                    return {user};
                }
                throw new Error('Авторизация требуется!');
            },
        },
        {
            server: httpServer,
            path: server.graphqlPath,
        }
    );

    httpServer.listen(4001, () => {
        console.log(`🚀 Сервер запущен: http://localhost:4000${server.graphqlPath}`);
        console.log(`🚀 Подписки готовы по адресу ws://localhost:4000${server.graphqlPath}`);
    });
});