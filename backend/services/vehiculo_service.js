import Vehiculo from "../models/vehiculo.js";
import db from "../config/PostgreSQLDatabase.js";

class VehiculoService {
  async crearVehiculo({ placa, color, modelo, marca, tipo, usuario }) {
    const vehiculo = new Vehiculo({
      placa,
      color,
      modelo,
      marca,
      tipo,
      usuario,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const result = await db.query(
      'INSERT INTO "VEHICULO" (placa, color, modelo, marca, tipo, usuario_id_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [
        vehiculo.placa,
        vehiculo.color,
        vehiculo.modelo,
        vehiculo.marca,
        vehiculo.tipo,
        vehiculo.usuario,
      ],
    );

    vehiculo.id = result[0].id;
    return vehiculo;
  }

  async listarVehiculos() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT id, placa, color, modelo, marca, tipo, usuario_id_usuario FROM "VEHICULO"',
    );

    const vehiculos = rows.map((row) => {
      const vehiculo = new Vehiculo({
        id: row.id,
        placa: row.placa,
        color: row.color,
        modelo: row.modelo,
        marca: row.marca,
        tipo: row.tipo,
        usuario: row.usuario,
      });
      return vehiculo;
    });
    return vehiculos;
  }

  async obtenerVehiculoPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT id, placa, color, modelo, marca, tipo, usuario_id_usuario FROM "VEHICULO" WHERE id = $1',
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    const vehiculo = new Vehiculo({
      id: row.id,
      placa: row.placa,
      color: row.color,
      modelo: row.modelo,
      marca: row.marca,
      tipo: row.tipo,
      usuario: row.usuario,
    });
    return vehiculo;
  }

  async actualizarVehiculo(id, datosActualizados) {
    const vehiculo = await this.obtenerVehiculoPorId(id);
    if (!vehiculo) return null;

    if (datosActualizados.placa !== undefined)
      vehiculo.placa = datosActualizados.placa;
    if (datosActualizados.color !== undefined)
      vehiculo.color = datosActualizados.color;
    if (datosActualizados.modelo !== undefined)
      vehiculo.modelo = datosActualizados.modelo;
    if (datosActualizados.marca !== undefined)
      vehiculo.marca = datosActualizados.marca;
    if (datosActualizados.tipo !== undefined)
      vehiculo.tipo = datosActualizados.tipo;
    if (datosActualizados.usuario !== undefined)
      vehiculo.usuario = datosActualizados.usuario;

    await db.query(
      'UPDATE "VEHICULO" SET placa = $1, color = $2, modelo = $3, marca = $4, tipo = $5, usuario_id_usuario = $6 WHERE id = $7',
      [
        vehiculo.placa,
        vehiculo.color,
        vehiculo.modelo,
        vehiculo.marca,
        vehiculo.tipo,
        vehiculo.usuario,
        vehiculo.id,
      ],
    );

    return vehiculo;
  }

  async eliminarVehiculo(id) {
    const vehiculo = await this.obtenerVehiculoPorId(id);
    if (!vehiculo) return null;

    await db.query('DELETE FROM "VEHICULO" WHERE id = $1', [vehiculo.id]);
    return vehiculo;
  }
}

export default new VehiculoService();