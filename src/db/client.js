import { default as pg } from "pg";

const { Client } = pg;

const client = new Client({
  database: "loopy",
});

client.connect();

export default client;
