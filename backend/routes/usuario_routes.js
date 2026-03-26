import express from "express";
import UsuarioService from "../services/usuario_service.js";
const routerUsuario = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *           example: 1
 *         tipoDocumento:
 *           type: string
 *           description: Tipo de documento (CC, CE, TI, etc.)
 *           example: "CC"
 *         numeroDocumento:
 *           type: string
 *           description: Número de documento de identidad
 *           example: "651684841"
 *         primerNombre:
 *           type: string
 *           description: Primer nombre del usuario
 *           example: "Abel"
 *         segundoNombre:
 *           type: string
 *           description: Segundo nombre del usuario
 *           nullable: true
 *           example: null
 *         primerApellido:
 *           type: string
 *           description: Primer apellido del usuario
 *           example: "Rivero"
 *         segundoApellido:
 *           type: string
 *           description: Segundo apellido del usuario
 *           example: "Herrera"
 *         direccionCorreo:
 *           type: string
 *           description: Correo electrónico del usuario
 *           format: email
 *           example: "abel.rivero@gmail.com"
 *         numeroCelular:
 *           type: string
 *           description: Número de teléfono celular
 *           example: "561465151"
 *         fotoPerfil:
 *           type: string
 *           description: URL de la foto de perfil
 *           example: "img/abel.jpg"
 *         estado:
 *           type: string
 *           description: Estado del usuario (activo, inactivo)
 *           enum: [activo, inactivo]
 *           example: "activo"
 *         clave:
 *           type: string
 *           description: Contraseña encriptada del usuario
 *           example: "$2b$10$..."
 *         perfilUsuario:
 *           type: integer
 *           description: ID del perfil de usuario (1=admin, 2=operador, 3=usuario)
 *           example: 3
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - tipoDocumento
 *         - numeroDocumento
 *         - primerNombre
 *         - primerApellido
 *         - clave
 *         - perfilUsuario
 *         - direccionCorreo
 *         - numeroCelular
 *       properties:
 *         tipoDocumento:
 *           type: string
 *           description: Tipo de documento
 *           example: "CC"
 *         numeroDocumento:
 *           type: string
 *           description: Número de documento
 *           example: "123456789"
 *         primerNombre:
 *           type: string
 *           description: Primer nombre
 *           example: "Juan"
 *         segundoNombre:
 *           type: string
 *           description: Segundo nombre
 *           example: "Carlos"
 *         primerApellido:
 *           type: string
 *           description: Primer apellido
 *           example: "Pérez"
 *         segundoApellido:
 *           type: string
 *           description: Segundo apellido
 *           example: "García"
 *         direccionCorreo:
 *           type: string
 *           description: Correo electrónico
 *           format: email
 *           example: "juan.perez@email.com"
 *         numeroCelular:
 *           type: string
 *           description: Número de celular
 *           example: "3001234567"
 *         fotoPerfil:
 *           type: string
 *           description: URL de foto de perfil
 *           example: "img/foto.jpg"
 *         estado:
 *           type: string
 *           description: Estado del usuario
 *           enum: [activo, inactivo]
 *           default: "activo"
 *           example: "activo"
 *         clave:
 *           type: string
 *           description: Contraseña del usuario
 *           example: "miPassword123"
 *         perfilUsuario:
 *           type: integer
 *           description: ID del perfil de usuario
 *           example: 3
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     description: Retorna una lista de todos los usuarios registrados en el sistema
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *                 message:
 *                   type: string
 *                   example: "Usuarios obtenidos exitosamente"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerUsuario.get("/", async (req, res) => {
  try {
    const usuarios = await UsuarioService.listarUsuarios();
    res.status(200).json({
      success: true,
      data: usuarios,
      message: "Usuarios obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Retorna los datos de un usuario específico según su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del usuario
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *                 message:
 *                   type: string
 *                   example: "Usuario obtenido exitosamente"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerUsuario.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuario = await UsuarioService.obtenerUsuarioPorId(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: usuario,
      message: "Usuario obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *                 message:
 *                   type: string
 *                   example: "Usuario creado exitosamente"
 *       400:
 *         description: Error de validación - campos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Faltan campos obligatorios: tipoDocumento, numeroDocumento, primerNombre, primerApellido, clave, perfilUsuario"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerUsuario.post("/", async (req, res) => {
  try {
    const {
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
      clave,
      perfilUsuario,
    } = req.body;

    if (
      !tipoDocumento ||
      !numeroDocumento ||
      !primerNombre ||
      !primerApellido ||
      !clave ||
      !perfilUsuario
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos obligatorios: tipoDocumento, numeroDocumento, primerNombre, primerApellido, clave, perfilUsuario",
      });
    }

    const usuario = await UsuarioService.crearUsuario({
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
      clave,
      perfilUsuario,
    });

    res.status(201).json({
      success: true,
      data: usuario,
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Actualiza los datos de un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del usuario a actualizar
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoDocumento:
 *                 type: string
 *               numeroDocumento:
 *                 type: string
 *               primerNombre:
 *                 type: string
 *               segundoNombre:
 *                 type: string
 *               primerApellido:
 *                 type: string
 *               segundoApellido:
 *                 type: string
 *               direccionCorreo:
 *                 type: string
 *               numeroCelular:
 *                 type: string
 *               fotoPerfil:
 *                 type: string
 *               estado:
 *                 type: string
 *               clave:
 *                 type: string
 *               perfilUsuario:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado exitosamente"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerUsuario.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const usuarioActualizado = await UsuarioService.actualizarUsuario(
      id,
      datosActualizados,
    );

    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: usuarioActualizado,
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario del sistema
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del usuario a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado exitosamente"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerUsuario.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuarioEliminado = await UsuarioService.eliminarUsuario(id);

    if (!usuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
});

export default routerUsuario;