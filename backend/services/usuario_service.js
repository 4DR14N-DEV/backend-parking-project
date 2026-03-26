import Usuario from "../models/usuario.js";
import db from "../config/PostgreSQLDatabase.js";
import bcrypt from "bcrypt";

class UsuarioService {
  async crearUsuario({
    tipoDocumento,
    numeroDocumento,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    direccionCorreo,
    numeroCelular,
    fotoPerfil,
    estado = "activo",
    clave,
    perfilUsuario,
  }) {
    const saltRounds = 10;
    const encryptedPass = await bcrypt.hash(clave, saltRounds);
    const usuario = new Usuario({
      tipoDocumento,
      numeroDocumento,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      direccionCorreo,
      numeroCelular,
      fotoPerfil,
      estado,
      clave: encryptedPass,
      perfilUsuario,
    });

    //Conectar si aun no hay conexión activa
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    //INSERT usando los getters del objeto para respetar la encapsulacion
    const result = await db.query(
      'INSERT INTO "USUARIO" (tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_correo, numero_celular, foto_perfil, estado, clave, perfil_usuario_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
      [
        usuario.tipoDocumento,
        usuario.numeroDocumento,
        usuario.primerNombre,
        usuario.segundoNombre,
        usuario.primerApellido,
        usuario.segundoApellido,
        usuario.direccionCorreo,
        usuario.numeroCelular,
        usuario.fotoPerfil,
        usuario.estado,
        usuario.clave,
        usuario.perfilUsuario,
      ],
    );

    usuario.id = result[0].id;
    return usuario;
  }

  async listarUsuarios() {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT id_usuario, tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_correo, numero_celular, foto_perfil, estado, clave, perfil_usuario_id FROM "USUARIO"',
    );

    const usuarios = rows.map((row) => {
      const usuario = new Usuario({
        id: row.id_usuario,
        tipoDocumento: row.tipo_documento,
        numeroDocumento: row.numero_documento,
        primerNombre: row.primer_nombre,
        segundoNombre: row.segundo_nombre,
        primerApellido: row.primer_apellido,
        segundoApellido: row.segundo_apellido,
        direccionCorreo: row.direccion_correo,
        numeroCelular: row.numero_celular,
        fotoPerfil: row.foto_perfil,
        estado: row.estado,
        clave: row.clave,
        perfilUsuario: row.perfil_usuario_id,
      });
      return usuario;
    });
    return usuarios;
  }

  async obtenerUsuarioPorId(id) {
    try {
      db.getConnection();
    } catch {
      await db.connect();
    }

    const rows = await db.query(
      'SELECT id_usuario, tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion_correo, numero_celular, foto_perfil, estado, clave, perfil_usuario_id FROM "USUARIO" WHERE id_usuario = $1',
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    const usuario = new Usuario({
      id: row.id_usuario,
      tipoDocumento: row.tipo_documento,
      numeroDocumento: row.numero_documento,
      primerNombre: row.primer_nombre,
      segundoNombre: row.segundo_nombre,
      primerApellido: row.primer_apellido,
      segundoApellido: row.segundo_apellido,
      direccionCorreo: row.direccion_correo,
      numeroCelular: row.numero_celular,
      fotoPerfil: row.foto_perfil,
      estado: row.estado,
      clave: row.clave,
      perfilUsuario: row.perfil_usuario_id,
    });
    return usuario;
  }

  async actualizarUsuario(id, datosActualizados) {
    //Obtener el objeto desde la base de datos
    const usuario = await this.obtenerUsuarioPorId(id);
    if (!usuario) {
      return null;
    }

    //Aplicar cambios sobre el objeto Usando los setters nativos
    if (datosActualizados.tipoDocumento !== undefined)
      usuario.tipoDocumento = datosActualizados.tipoDocumento;
    if (datosActualizados.numeroDocumento !== undefined)
      usuario.numeroDocumento = datosActualizados.numeroDocumento;
    if (datosActualizados.primerNombre !== undefined)
      usuario.primerNombre = datosActualizados.primerNombre;
    if (datosActualizados.segundoNombre !== undefined)
      usuario.segundoNombre = datosActualizados.segundoNombre;
    if (datosActualizados.primerApellido !== undefined)
      usuario.primerApellido = datosActualizados.primerApellido;
    if (datosActualizados.segundoApellido !== undefined)
      usuario.segundoApellido = datosActualizados.segundoApellido;
    if (datosActualizados.direccionCorreo !== undefined)
      usuario.direccionCorreo = datosActualizados.direccionCorreo;
    if (datosActualizados.numeroCelular !== undefined)
      usuario.numeroCelular = datosActualizados.numeroCelular;
    if (datosActualizados.fotoPerfil !== undefined)
      usuario.fotoPerfil = datosActualizados.fotoPerfil;
    if (datosActualizados.estado !== undefined)
      usuario.estado = datosActualizados.estado;
    if (datosActualizados.clave !== undefined)
      usuario.clave = await bcrypt.hash(datosActualizados.clave, 10);
    if (datosActualizados.perfilUsuario !== undefined)
      usuario.perfilUsuario = datosActualizados.perfilUsuario;

    //Persistir en la base de datos usando los getters del objeto actualizado
    await db.query(
      'UPDATE "USUARIO" SET tipo_documento = $1, numero_documento = $2, primer_nombre = $3, segundo_nombre = $4, primer_apellido = $5, segundo_apellido = $6, direccion_correo = $7, numero_celular = $8, foto_perfil = $9, estado = $10, clave = $11, perfil_usuario_id = $12 WHERE id_usuario = $13',
      [
        usuario.tipoDocumento,
        usuario.numeroDocumento,
        usuario.primerNombre,
        usuario.segundoNombre,
        usuario.primerApellido,
        usuario.segundoApellido,
        usuario.direccionCorreo,
        usuario.numeroCelular,
        usuario.fotoPerfil,
        usuario.estado,
        usuario.clave,
        usuario.perfilUsuario,
        usuario.id,
      ],
    );

    return usuario;
  }

  async eliminarUsuario(id) {
    //Obtener el objeto desde la base de datos
    const usuario = await this.obtenerUsuarioPorId(id);
    if (!usuario) {
      return null;
    }

    await db.query('DELETE FROM "USUARIO" WHERE id_usuario = $1', [usuario.id]);
    return usuario;
  }
}

export default new UsuarioService();
