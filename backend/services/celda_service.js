import Celda from "../models/celda.js";
import db from "../config/PostgreSQLDatabase.js";
class CeldaService {
  async crearCelda({ tipo, estado }) {
    const celda = new Celda({
      tipo,
      estado,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const result = await db.query(
      "INSERT INTO celda (tipo, estado) VALUES ($1, $2) RETURNING id",
      [celda.tipo, celda.estado],
    );

    celda.id = result[0].id;
    return celda;
  }

  async listarCeldas() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query("SELECT id, tipo, estado FROM celda");

    const celdas = rows.map((row) => {
      const celda = new Celda({
        id: row.id,
        tipo: row.tipo,
        estado: row.estado,
      });
      return celda;
    });
    return celdas;
  }

  async obtenerCeldaPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      "SELECT id, tipo, estado FROM celda WHERE id = $1",
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const celda = new Celda({
      id: row.id,
      tipo: row.tipo,
      estado: row.estado,
    });
    return celda;
  }

  async actualizarCelda(id, datosActualizados) {
    const celda = await this.obtenerCeldaPorId(id);
    if (!celda) return null;

    if (datosActualizados.tipo !== undefined)
      celda.tipo = datosActualizados.tipo;
    if (datosActualizados.estado !== undefined)
      celda.estado = datosActualizados.estado;

    await db.query("UPDATE celda SET tipo = $1, estado = $2 WHERE id = $3", [
      celda.tipo,
      celda.estado,
      celda.id,
    ]);

    return celda;
  }

  async eliminarCelda(id) {
    const celda = await this.obtenerCeldaPorId(id);
    if (!celda) return null;

    await db.query("DELETE FROM celda WHERE id = $1", [celda.id]);
    return celda;
  }
}

export default new CeldaService();
