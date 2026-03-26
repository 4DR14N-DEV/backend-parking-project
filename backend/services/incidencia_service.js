import Incidencia from "../models/incidencia.js";
import db from "../config/PostgreSQLDatabase.js";

class IncidenciaService {
  async crearIncidencia({ nombre }) {
    const incidencia = new Incidencia({
      nombre,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const result = await db.query(
      "INSERT INTO incidencia (nombre) VALUES ($1) RETURNING id",
      [incidencia.nombre],
    );

    incidencia.id = result[0].id;
    return incidencia;
  }

  async listarIncidencias() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query("SELECT id, nombre FROM incidencia");

    const incidencias = rows.map((row) => {
      const incidencia = new Incidencia({
        id: row.id,
        nombre: row.nombre,
      });
      return incidencia;
    });
    return incidencias;
  }

  async obtenerIncidenciaPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      "SELECT id, nombre FROM incidencia WHERE id = $1",
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const incidencia = new Incidencia({
      id: row.id,
      nombre: row.nombre,
    });
    return incidencia;
  }

  async actualizarIncidencia(id, datosActualizados) {
    const incidencia = await this.obtenerIncidenciaPorId(id);
    if (!incidencia) return null;

    if (datosActualizados.nombre !== undefined)
      incidencia.nombre = datosActualizados.nombre;

    await db.query("UPDATE incidencia SET nombre = $1 WHERE id = $2", [
      incidencia.nombre,
      incidencia.id,
    ]);
    return incidencia;
  }

  async eliminarIncidencia(id) {
    const incidencia = await this.obtenerIncidenciaPorId(id);
    if (!incidencia) return null;

    await db.query("DELETE FROM incidencia WHERE id = $1", [incidencia.id]);
    return incidencia;
  }
}

export default new IncidenciaService();
