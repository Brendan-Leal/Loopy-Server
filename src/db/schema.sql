CREATE TABLE users (
    user_id serial PRIMARY KEY,
    email text,
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
    expire_time time
);