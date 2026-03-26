import HistorialParqueo from "../models/historial_parqueo.js";
import db from "../config/PostgreSQLDatabase.js";

class HistorialParqueoService {
  async crearHistorialParqueo({ celda, vehiculo, fechaHora }) {
    const historialParqueo = new HistorialParqueo({
      celda,
      vehiculo,
      fechaHora,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    await db.query(
      'INSERT INTO "HISTORIAL_PARQUEO" (vehiculo_id, celda_id, fecha_hora) VALUES ($1, $2, $3)',
      [
        historialParqueo.vehiculo,
        historialParqueo.celda,
        historialParqueo.fechaHora,
      ],
    );

    return historialParqueo;
  }

  async listarHistorial() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT vehiculo_id, celda_id, fecha_hora FROM "HISTORIAL_PARQUEO"',
    );

    const historialParqueos = rows.map((row) => {
      const historialParqueo = new HistorialParqueo({
        vehiculo: row.vehiculo_id,
        celda: row.celda_id,
        fechaHora: row.fecha_hora,
      });
      return historialParqueo;
    });
    return historialParqueos;
  }

  async obtenerHistorial(vehiculoId, celdaId) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT vehiculo_id, celda_id, fecha_hora FROM "HISTORIAL_PARQUEO" WHERE vehiculo_id = $1 AND celda_id = $2',
      [vehiculoId, celdaId],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const historialParqueo = new HistorialParqueo({
      vehiculo: row.vehiculo_id,
      celda: row.celda_id,
      fechaHora: row.fecha_hora,
    });

    return historialParqueo;
  }

  async eliminarHistorial(vehiculoId, celdaId) {
    const historialParqueo = await this.obtenerHistorial(vehiculoId, celdaId);
    if (!historialParqueo) return null;

    await db.query(
      'DELETE FROM "HISTORIAL_PARQUEO" WHERE vehiculo_id = $1 AND celda_id = $2',
      [historialParqueo.vehiculo, historialParqueo.celda],
    );
    return historialParqueo;
  }
}

export default new HistorialParqueoService();