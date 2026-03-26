import { Pool } from "pg";
import Database from "./database.js";

// Las variables de entorno vienen de Vercel (process.env.DATABASE_URL)

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

    this.pool = new Pool({
      host: host,
      port: port,
      database: database,
      user: user,
      password: password,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
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
      // Ejecutar SET search_path y verificar
      await this.pool.query("SET search_path TO ParkingLot");
      
      // Verificar tablas disponibles en el esquema ParkingLot
      const tablesResult = await this.pool.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'ParkingLot'"
      );
      console.log("🔧 Tablas en ParkingLot:", tablesResult.rows.map(r => r.table_name));
      
      const result = await this.pool.query(sqlString, params);
      return result.rows;
    } catch (error) {
      // Si hay error de conexión, intentar reconectar
      if (error.code === '57P01' || error.code === '57P02' || error.code === '57P03') {
        this.isConnected = false;
        await this.connect();
        await this.pool.query("SET search_path TO ParkingLot");
        const result = await this.pool.query(sqlString, params);
        return result.rows;
      }
      throw error;
    }
  }
}

export default new PostgreSQLDatabase();
