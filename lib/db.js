import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "local",
  port: 10004,
});

export default db;
