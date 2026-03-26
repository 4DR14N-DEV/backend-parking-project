/**
 * Clase abstracta que define el contraro para cualquier implementacion de conexion a bese de datos
 */
class Database {
  constructor() {
    if (new.target === Database) {
      throw new Error(
        "Databse es una clase abstracta y no puede ser instaciada directamente",
      );
    }
  }

  /**
   * Establece la conexión con la base de datos
   * @returns {Promise<void>}
   */
  async connect() {
    throw new Error("El método connect debe ser implementado por la subclase");
  }

  /**
   * Cierra la conexión con la base de datos
   * @returns {Promise<void>}
   */
  async disconnect() {
    throw new Error(
      "El metodo disconnect() debe ser implementado por la subclase",
    );
  }

  /**
   * Retorna la conexión activa (pool o cliente)
   * @returns {*}
   */
  getConnection() {
    throw new Error(
      "El método getConnection() deber ser implementado por la subclase",
    );
  }
}

export default Database;
