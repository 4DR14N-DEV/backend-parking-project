import ReporteIncidencia from "../models/reporte_incidencia.js";
import db from "../config/PostgreSQLDatabase.js";

class ReporteIncidenciaService {
  async crearReporteIncidencia({ vehiculo, incidencia, fechaHora }) {
    const reporteIncidencia = new ReporteIncidencia({
      vehiculo,
      incidencia,
      fechaHora,
    });

    //Conectar si aun hay conexión activa
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    //INSERT usando los getters del objeto para respetar la encapsulacion
    await db.query(
      "INSERT INTO reporte_incidencia (vehiculo_id, incidencia_id, fecha_hora) VALUES ($1, $2, $3)",
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
      "SELECT vehiculo_id, incidencia_id, fecha_hora FROM reporte_incidencia",
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
      "SELECT vehiculo_id, incidencia_id, fecha_hora FROM reporte_incidencia WHERE vehiculo_id = $1 AND incidencia_id = $2",
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
    //Obtener el objeto desde la base de datos
    const reporteIncidencia = await this.obtenerReporteIncidencia(
      vehiculoId,
      incidenciaId,
    );
    if (!reporteIncidencia) return null;

    //Aplicar cambios sobre el objeto usando los setters nativos
    if (datosActualizados.fechaHora !== undefined)
      reporteIncidencia.fechaHora = datosActualizados.fechaHora;

    //Persistir en l base de datos usando los getters del objeto actualizado
    await db.query(
      "UPDATE reporte_incidencia SET fecha_hora = $1 WHERE vehiculo_id = $2 AND incidencia_id = $3",
      [
        reporteIncidencia.fechaHora,
        reporteIncidencia.vehiculo,
        reporteIncidencia.incidencia,
      ],
    );

    return reporteIncidencia;
  }

  async eliminarReporteIncidencia(vehiculoId, incidenciaId) {
    //Obtener el objeto desde la base de datos
    const reporteIncidencia = await this.obtenerReporteIncidencia(
      vehiculoId,
      incidenciaId,
    );
    if (!reporteIncidencia) return null;

    await db.query(
      "DELETE FROM reporte_incidencia WHERE vehiculo_id = $1 AND incidencia_id = $2",
      [reporteIncidencia.vehiculo, reporteIncidencia.incidencia],
    );
    return reporteIncidencia;
  }
}

export default new ReporteIncidenciaService();
