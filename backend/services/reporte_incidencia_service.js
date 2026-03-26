import ReporteIncidencia from "../models/reporte_incidencia.js";
import db from "../config/PostgreSQLDatabase.js";

class ReporteIncidenciaService {
  async crearReporteIncidencia({ vehiculo, incidencia, fechaHora }) {
    const reporteIncidencia = new ReporteIncidencia({
      vehiculo,
      incidencia,
      fechaHora,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    await db.query(
      'INSERT INTO "REPORTE_INCIDENCIA" (vehiculo_id, incidencia_id, fecha_hora) VALUES ($1, $2, $3)',
      [
        reporteIncidencia.vehiculo,
        reporteIncidencia.incidencia,
        reporteIncidencia.fechaHora,
      ],
    );

    return reporteIncidencia;
  }

  async listarReporteIncidencia() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT vehiculo_id, incidencia_id, fecha_hora FROM "REPORTE_INCIDENCIA"',
    );

    const reporteIncidencias = rows.map((row) => {
      const reporteIncidencia = new ReporteIncidencia({
        vehiculo: row.vehiculo_id,
        incidencia: row.incidencia_id,
        fechaHora: row.fecha_hora,
      });
      return reporteIncidencia;
    });
    return reporteIncidencias;
  }

  async obtenerReporteIncidencia(vehiculoId, incidenciaId) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT vehiculo_id, incidencia_id, fecha_hora FROM "REPORTE_INCIDENCIA" WHERE vehiculo_id = $1 AND incidencia_id = $2',
      [vehiculoId, incidenciaId],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const reporteIncidencia = new ReporteIncidencia({
      vehiculo: row.vehiculo_id,
      incidencia: row.incidencia_id,
      fechaHora: row.fecha_hora,
    });
    return reporteIncidencia;
  }

  async actualizarReporteIncidencia(
    vehiculoId,
    incidenciaId,
    datosActualizados,
  ) {
    const reporteIncidencia = await this.obtenerReporteIncidencia(
      vehiculoId,
      incidenciaId,
    );
    if (!reporteIncidencia) return null;

    if (datosActualizados.fechaHora !== undefined)
      reporteIncidencia.fechaHora = datosActualizados.fechaHora;

    await db.query(
      'UPDATE "REPORTE_INCIDENCIA" SET fecha_hora = $1 WHERE vehiculo_id = $2 AND incidencia_id = $3',
      [
        reporteIncidencia.fechaHora,
        reporteIncidencia.vehiculo,
        reporteIncidencia.incidencia,
      ],
    );

    return reporteIncidencia;
  }

  async eliminarReporteIncidencia(vehiculoId, incidenciaId) {
    const reporteIncidencia = await this.obtenerReporteIncidencia(
      vehiculoId,
      incidenciaId,
    );
    if (!reporteIncidencia) return null;

    await db.query(
      'DELETE FROM "REPORTE_INCIDENCIA" WHERE vehiculo_id = $1 AND incidencia_id = $2',
      [reporteIncidencia.vehiculo, reporteIncidencia.incidencia],
    );
    return reporteIncidencia;
  }
}

export default new ReporteIncidenciaService();