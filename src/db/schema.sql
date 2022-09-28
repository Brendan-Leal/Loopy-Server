-- CREATE TABLE users (
--     user_id serial PRIMARY KEY,
--     email text,
--     spotify_username text,
--     display_name text,
--     is_premium boolean,
--     profile_url text
-- );

CREATE TABLE tokens (
    token_id serial PRIMARY KEY,
    user_id integer REFERENCES users(user_id),
    access_token text,
    refresh_token text,
    expire_time TIMESTAMP 
);

-- access_t: BQATDwspYDl9q546TYzYooNh0oK43dxbL7lwDOhvAkGupDu9ThoyPaFwX3ZSNWfGyxVVyyN3sB2t2IbgtHk9V63BzWgN00nDWg-6PKG28b59cciPVVZaSyK89FvzM4ddNW5Mf4sQI7_bzF-NGSHeNNCI1w2opUvZ7m9JEfi6IS0BP6PxokN6U0fdKyTVRPrhH9iVmBM

-- refresh: AQAgImiU_iB7K91HSfMWd6dBZSCoIi93zb2KFGAjJi2yDZHqqMe1wU28Aef02iIpKxKlVBNBkRTxtzVVFIZr9iw1I5Ma-Hzl2D6g9zBxR2g7T28n070aAHIxMtIlrPLQDGU