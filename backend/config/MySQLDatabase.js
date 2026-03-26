import mysql from "mysql2/promise";
import dotenv from "dotenv";
import Database from "./database.js";

dotenv.config({ override: true });

class MySQLDatabase extends Database {
  constructor() {
    super();
    this.pool = null;
  }

  async connect() {
    // const password = process.env.PASSWORD === "" ? null : process.env.PASSWORD;

    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.USER,
      password: null,
      database: process.env.DB,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    //Verificar que la conexión es valida
    const connection = await this.pool.getConnection();
    console.log(
      `✓ Conexión a MySQL establecida — base de datos: "${process.env.DB}"`,
    );
    connection.release();
  }

  async disconnect() {
    if (!this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log("✓ Conexión a MySQL cerrada correctamente.");
    }
  }

  getConnection() {
    if (!this.pool) {
      throw new Error(
        "No hay conexión activa. Llama a connect() antes de getConnection().",
      );
    }
    return this.pool;
  }
}

export default new MySQLDatabase();
