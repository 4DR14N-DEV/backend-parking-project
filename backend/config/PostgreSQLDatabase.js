import pg from "pg";
import { config } from "dotenv";
import { promisify } from "util";
import dns from "dns";
import Database from "./database.js";

// Cargar .env solo si existe (en local), en Vercel ya está configurado
config();

const resolve4 = promisify(dns.resolve4);

class PostgreSQLDatabase extends Database {
  constructor() {
    super();
    this.pool = null;
    this.isConnected = false;
  }

  async connect() {
    // Si ya está conectado, no reconnect
    if (this.pool && this.isConnected) {
      return;
    }

    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error("DATABASE_URL no está configurada en las variables de entorno");
    }
    
    // Extraer configuración de la URL
    const urlObj = new URL(connectionString);
    const host = urlObj.hostname;
    const port = parseInt(urlObj.port) || 5432;
    const database = urlObj.pathname.slice(1);
    const user = urlObj.username;
    const password = urlObj.password;

    // Resolución DNS manual - priorizar IPv4
    let finalHost = host;
    try {
      const ipv4Addresses = await resolve4(host);
      if (ipv4Addresses && ipv4Addresses.length > 0) {
        finalHost = ipv4Addresses[0];
        if (process.env.NODE_ENV !== "production") {
          console.log(`✓ Resuelto IPv4 para ${host}: ${ipv4Addresses[0]}`);
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`⚠ Error al resolver DNS: ${e.message}, usando hostname original`);
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`🔄 Conectando a ${finalHost}:${port}...`);
    }

    this.pool = new pg.Pool({
      host: finalHost,
      port: port,
      database: database,
      user: user,
      password: password,
      max: 5, // Reducido para Vercel/serverless
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });

    // Manejar errores de conexión
    this.pool.on("error", (err) => {
      console.error("Error inesperado en el pool de PostgreSQL:", err.message);
      this.isConnected = false;
    });

    // Verificar que la conexión es válida
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT current_database() as db, NOW() as hora');
      this.isConnected = true;
      if (process.env.NODE_ENV !== "production") {
        console.log(`✓ Conexión a PostgreSQL establecida — base de datos: "${result.rows[0].db}"`);
      }
      client.release();
    } catch (error) {
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      if (process.env.NODE_ENV !== "production") {
        console.log("✓ Conexión a PostgreSQL cerrada correctamente.");
      }
    }
  }

  getConnection() {
    if (!this.pool) {
      throw new Error(
        "No hay conexión activa. Llama a connect() antes de getConnection()."
      );
    }
    return this.pool;
  }

  /**
   * Método helper para ejecutar queries con parámetros estilo MySQL
   */
  async query(sqlString, params = []) {
    // Reconectar si es necesario
    if (!this.pool || !this.isConnected) {
      await this.connect();
    }

    try {
      const result = await this.pool.query(sqlString, params);
      return result.rows;
    } catch (error) {
      // Si hay error de conexión, intentar reconectar
      if (error.code === '57P01' || error.code === '57P02' || error.code === '57P03') {
        this.isConnected = false;
        await this.connect();
        const result = await this.pool.query(sqlString, params);
        return result.rows;
      }
      throw error;
    }
  }
}

export default new PostgreSQLDatabase();
