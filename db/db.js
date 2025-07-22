import { createPool } from "mysql2/promise";

const conn = createPool({
  host: "127.0.0.1",
  user: "root",
  password: "8mei523m",
  port: "3306",
  database: "pruebas",
});

export { conn };