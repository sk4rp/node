const {query} = require('./db');
const {pubSub} = require('./subscriptions');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'testing123123';

const resolvers = {
    Query: {
        users: async () => {
            try {
                const res = await query('SELECT * FROM users');
                return res.rows;
            } catch (error) {
                console.error('Ошибка при запросе пользователей:', error);
                throw new Error('Не удалось получить пользователей');
            }
        },
        messages: async () => {
            try {
                const res = await query('SELECT * FROM messages');
                return res.rows;
            } catch (error) {
                console.error('Ошибка при запросе сообщений:', error);
                throw new Error('Не удалось получить сообщения');
            }
        }
    },
    Mutation: {
        createUser: async (_, {username}) => {
            try {
                const res = await query('INSERT INTO users (username) VALUES ($1) RETURNING *', [username]);
                return res.rows[0];
            } catch (error) {
                console.error('Ошибка при создании пользователя:', error);
                throw new Error('Не удалось создать пользователя');
            }
        },
        createMessage: async (_, {content}, {user}) => {
            if (!user) throw new Error('Требуется авторизация');
            try {
                const res = await query('INSERT INTO messages (content, sender_id) VALUES ($1, $2) RETURNING *', [content, user.id]);
                const message = res.rows[0];

                const senderRes = await query('SELECT * FROM users WHERE id = $1', [user.id]);
                if (senderRes.rows.length === 0) {
                    throw new Error('Пользователь не найден');
                }
                message.sender = senderRes.rows[0];

                await pubSub.publish('MESSAGE_SENT', {messageSent: message});

                return message;
            } catch (error) {
                console.error('Ошибка при создании сообщения:', error);
                throw new Error('Не удалось создать сообщение');
            }
        },
        login: async (_, {username}) => {
            const userRes = await query('SELECT * FROM users WHERE username = $1', [username]);
            if (userRes.rows.length === 0) throw new Error('Пользователь не найден');

            const user = userRes.rows[0];
            const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: '1h'});

            return {token, user};
        },

    },
    Subscription: {
        messageSent: {
            subscribe: (_, __, {user}) => {
                if (!user) throw new Error('Требуется авторизация для подписки');
                return pubSub.asyncIterator('MESSAGE_SENT');
            }
        }
    }
};

module.exports = resolvers;