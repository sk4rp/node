const jwt = require('jsonwebtoken');
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const {ApolloServer} = require("apollo-server");
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

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers.authorization || '';
        const user = getUserFromToken(token.replace('Bearer ', ''));
        return {user};
    },
});
