import db from "../config/PostgreSQLDatabase.js";
import PicoPlaca from "../models/pico_placa.js";

class PicoPlacaService {
  async crearPicoPlaca({ tipoVehiculo, numero, dia }) {
    const picoPlaca = new PicoPlaca({
      tipoVehiculo,
      numero,
      dia,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const result = await db.query(
      'INSERT INTO "PICO_PLACA" (tipo_vehiculo, numero, dia) VALUES ($1, $2, $3) RETURNING id',
      [picoPlaca.tipoVehiculo, picoPlaca.numero, picoPlaca.dia],
    );

    picoPlaca.id = result[0].id;
    return picoPlaca;
  }

  async listarPicoPlaca() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT id, tipo_vehiculo, numero, dia FROM "PICO_PLACA"',
    );

    const picoPlacas = rows.map((row) => {
      const picoPlaca = new PicoPlaca({
        id: row.id,
        tipoVehiculo: row.tipo_vehiculo,
        numero: row.numero,
        dia: row.dia,
      });
      return picoPlaca;
    });
    return picoPlacas;
  }

  async obtenerPicoPlacaPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT id, tipo_vehiculo, numero, dia FROM "PICO_PLACA" WHERE id = $1',
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const picoPlaca = new PicoPlaca({
      id: row.id,
      tipoVehiculo: row.tipo_vehiculo,
      numero: row.numero,
      dia: row.dia,
    });
    return picoPlaca;
  }

  async actualizarPicoPlaca(id, datosActualizados) {
    const picoPlaca = await this.obtenerPicoPlacaPorId(id);
    if (!picoPlaca) return null;

    if (datosActualizados.tipoVehiculo !== undefined)
      picoPlaca.tipoVehiculo = datosActualizados.tipoVehiculo;
    if (datosActualizados.numero !== undefined)
      picoPlaca.numero = datosActualizados.numero;
    if (datosActualizados.dia !== undefined)
      picoPlaca.dia = datosActualizados.dia;

    await db.query(
      'UPDATE "PICO_PLACA" SET tipo_vehiculo = $1, numero = $2, dia = $3 WHERE id = $4',
      [picoPlaca.tipoVehiculo, picoPlaca.numero, picoPlaca.dia, picoPlaca.id],
    );

    return picoPlaca;
  }

  async eliminarPicoPlaca(id) {
    const picoPlaca = await this.obtenerPicoPlacaPorId(id);
    if (!picoPlaca) return null;

    await db.query('DELETE FROM "PICO_PLACA" WHERE id = $1', [picoPlaca.id]);
    return picoPlaca;
  }
}

export default new PicoPlacaService();