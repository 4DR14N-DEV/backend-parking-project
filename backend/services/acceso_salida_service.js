import AccesoSalida from "../models/acceso_salida.js";
import db from "../config/PostgreSQLDatabase.js";

class AccesoSalidaService {
  async crearAccesoSalida({
    movimiento,
    fechaHora,
    puerta,
    tiempoEstadia,
    vehiculo,
  }) {
    const accesoSalida = new AccesoSalida({
      movimiento,
      fechaHora,
      puerta,
      tiempoEstadia,
      vehiculo,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const result = await db.query(
      "INSERT INTO acceso_salidas (movimiento, fecha_hora, puerta, tiempo_estadia, vehiculo_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [
        accesoSalida.movimiento,
        accesoSalida.fechaHora,
        accesoSalida.puerta,
        accesoSalida.tiempoEstadia,
        accesoSalida.vehiculo,
      ],
    );

    accesoSalida.id = result[0].id;
    return accesoSalida;
  }

  async listarAccesoSalida() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      "SELECT id, movimiento, fecha_hora, puerta, tiempo_estadia, vehiculo_id FROM acceso_salidas",
    );

    const accesosSalidas = rows.map((row) => {
      return new AccesoSalida({
        id: row.id,
        movimiento: row.movimiento,
        fechaHora: row.fecha_hora,
        puerta: row.puerta,
        tiempoEstadia: row.tiempo_estadia,
        vehiculo: row.vehiculo_id,
      });
    });

    return accesosSalidas;
  }

  // Renombrado para ser más claro e implementando la Opción A (solo ID)
  async obtenerAccesoSalidaPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    // Consulta filtrando únicamente por id
    const rows = await db.query(
      "SELECT id, movimiento, fecha_hora, puerta, tiempo_estadia, vehiculo_id FROM acceso_salidas WHERE id = $1",
      [id],
    );

    // Bug lógico corregido
    if (rows.length === 0) return null;

    const row = rows[0];
    return new AccesoSalida({
      id: row.id,
      movimiento: row.movimiento,
      fechaHora: row.fecha_hora,
      puerta: row.puerta,
      tiempoEstadia: row.tiempo_estadia,
      vehiculo: row.vehiculo_id,
    });
  }

  async actualizarAccesoSalida(id, datosActualizados) {
    // Busca únicamente por ID
    const accesoSalida = await this.obtenerAccesoSalidaPorId(id);
    if (!accesoSalida) return null;

    if (datosActualizados.movimiento !== undefined)
      accesoSalida.movimiento = datosActualizados.movimiento;
    if (datosActualizados.fechaHora !== undefined)
      accesoSalida.fechaHora = datosActualizados.fechaHora;
    if (datosActualizados.puerta !== undefined)
      accesoSalida.puerta = datosActualizados.puerta;
    if (datosActualizados.tiempoEstadia !== undefined)
      accesoSalida.tiempoEstadia = datosActualizados.tiempoEstadia;

    // Actualiza únicamente usando el WHERE id = $1
    await db.query(
      "UPDATE acceso_salidas SET movimiento = $1, fecha_hora = $2, puerta = $3, tiempo_estadia = $4 WHERE id = $5",
      [
        accesoSalida.movimiento,
        accesoSalida.fechaHora,
        accesoSalida.puerta,
        accesoSalida.tiempoEstadia,
        accesoSalida.id,
      ],
    );

    return accesoSalida;
  }

  async eliminarAccesoSalida(id) {
    // Busca únicamente por ID
    const accesoSalida = await this.obtenerAccesoSalidaPorId(id);
    if (!accesoSalida) return null;

    // Elimina únicamente usando el WHERE id = $1
    await db.query("DELETE FROM acceso_salidas WHERE id = $1", [
      accesoSalida.id,
    ]);

    return accesoSalida;
  }
}

export default new AccesoSalidaService();
