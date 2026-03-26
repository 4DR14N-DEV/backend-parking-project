import PerfilUsuario from "../models/perfil_usuario.js";
import db from "../config/PostgreSQLDatabase.js";

class PerfilUsuarioService {
  async crearPerfilUsuario({ perfil }) {
    const perfilUsuario = new PerfilUsuario({
      perfil,
    });

    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const result = await db.query(
      'INSERT INTO "PERFIL_USUARIO" (perfil) VALUES ($1) RETURNING id',
      [perfilUsuario.perfil],
    );

    perfilUsuario.id = result[0].id;
    return perfilUsuario;
  }

  async listarPerfilesUsuario() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query('SELECT id, perfil FROM "PERFIL_USUARIO"');

    const perfilesUsuario = rows.map((row) => {
      const perfilUsuario = new PerfilUsuario({
        id: row.id,
        perfil: row.perfil,
      });
      return perfilUsuario;
    });
    return perfilesUsuario;
  }

  async obtenerPerfilUsuarioPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT id, perfil FROM "PERFIL_USUARIO" WHERE id = $1',
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const perfilUsuario = new PerfilUsuario({
      id: row.id,
      perfil: row.perfil,
    });
    return perfilUsuario;
  }

  async actualizarPerfilUsuario(id, datosActualizados) {
    const perfilUsuario = await this.obtenerPerfilUsuarioPorId(id);
    if (!perfilUsuario) return null;

    if (datosActualizados.perfil !== undefined)
      perfilUsuario.perfil = datosActualizados.perfil;

    await db.query('UPDATE "PERFIL_USUARIO" SET perfil = $1 WHERE id = $2', [
      perfilUsuario.perfil,
      perfilUsuario.id,
    ]);

    return perfilUsuario;
  }

  async eliminarPerfilUsuario(id) {
    const perfilUsuario = await this.obtenerPerfilUsuarioPorId(id);
    if (!perfilUsuario) return null;

    await db.query('DELETE FROM "PERFIL_USUARIO" WHERE id = $1', [
      perfilUsuario.id,
    ]);
    return perfilUsuario;
  }
}

export default new PerfilUsuarioService();