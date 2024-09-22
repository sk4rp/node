const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
    }

    type Message {
        id: ID!
        content: String!
        sender: User!
        createdAt: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        users: [User]
        messages: [Message]
    }

    type Mutation {
        createUser(username: String!): User
        createMessage(content: String!): Message
        register(username: String!): AuthPayload
        login(username: String!): AuthPayload
    }

    type Subscription {
        messageSent: Message
    }
`;

module.exports = typeDefs;