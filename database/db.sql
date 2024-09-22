--  Database schema
CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);

CREATE TABLE messages
(
    id         SERIAL PRIMARY KEY,
    content    TEXT NOT NULL,
    sender_id  INT REFERENCES users (id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Trigger
CREATE OR REPLACE FUNCTION notify_new_message() RETURNS trigger AS
$$
BEGIN
    PERFORM pg_notify('new_message', row_to_json(NEW)::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_message_trigger
    AFTER INSERT
    ON messages
    FOR EACH ROW
EXECUTE FUNCTION notify_new_message();


