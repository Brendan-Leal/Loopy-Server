DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id serial PRIMARY KEY,
    email text UNIQUE, 
    spotify_username text,
    display_name text,
    is_premium boolean,
    profile_url text
);

CREATE TABLE tokens (
    token_id serial PRIMARY KEY,
    user_id integer REFERENCES users(user_id),
    access_token text,
    refresh_token text,
    expire_time TIMESTAMPTZ 
);

INSERT INTO users (email, spotify_username, display_name, is_premium, profile_url)
VALUES ('baz@foo.com', 'baz', 'bazzy', true, 'https://open.spotify/user/baz');
