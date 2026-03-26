import express from "express";
import PerfilUsuarioService from "../services/perfil_usuario_service.js";
const routerPerfilUsuario = express.Router();

/**
 * @swagger
 * /api/perfil-usuario:
 *   get:
 *     summary: Listar perfiles de usuario
 *     description: Obtiene todos los perfiles de usuario registrados en el sistema
 *     tags:
 *       - Perfil Usuario
 *     responses:
 *       200:
 *         description: Perfiles de usuario obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 - ID: 1
 *                   PERFIL: "Administrador"
 *               message: "Perfiles de usuario obtenidos exitosamente"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al obtener los perfiles de usuario"
 *               error: "Error details"
 */
//Listar perfiles de usuario
routerPerfilUsuario.get("/", async (req, res) => {
  try {
    const perfilUsuarios = await PerfilUsuarioService.listarPerfilesUsuario();
    res.status(200).json({
      success: true,
      data: perfilUsuarios,
      message: "Perfiles de usuario obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los perfiles de usuario",
      error: error.message,
    });
  }
});

//Obtener perfil de usuario por ID
/**
 * @swagger
 * /api/perfil-usuario/{id}:
 *   get:
 *     summary: Obtener perfil de usuario por ID
 *     description: Obtiene un perfil de usuario específico mediante su ID
 *     tags:
 *       - Perfil Usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del perfil de usuario
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Perfil de usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 ID: 1
 *                 PERFIL: "Administrador"
 *               message: "Perfil de usuario obtenido exitosamente"
 *       404:
 *         description: Perfil de usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Perfil de usuario no encontrado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al obtener perfil de usuario"
 *               error: "Error details"
 */
routerPerfilUsuario.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const perfilUsuario =
      await PerfilUsuarioService.obtenerPerfilUsuarioPorId(id);

    if (!perfilUsuario) {
      return res.status(404).json({
        success: false,
        message: "Perfil de usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: perfilUsuario,
      message: "Perfil de usuario obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil de usuario",
      error: error.message,
    });
  }
});

//Crear nuevo perfil de usuario
/**
 * @swagger
 * /api/perfil-usuario:
 *   post:
 *     summary: Crear nuevo perfil de usuario
 *     description: Registra un nuevo perfil de usuario en el sistema
 *     tags:
 *       - Perfil Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - perfil
 *             properties:
 *               perfil:
 *                 type: string
 *                 description: Nombre del perfil de usuario
 *                 example: "Administrador"
 *     responses:
 *       201:
 *         description: Perfil de usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 ID: 2
 *                 PERFIL: "Operario"
 *               message: "Perfil de usuario creado exitosamente"
 *       400:
 *         description: Datos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios: perfil"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al crear perfil de usuario"
 *               error: "Error details"
 */
routerPerfilUsuario.post("/", async (req, res) => {
  try {
    const { perfil } = req.body;

    if (!perfil) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: perfil",
      });
    }

    const perfilUsuario = await PerfilUsuarioService.crearPerfilUsuario({
      perfil,
    });

    res.status(201).json({
      success: true,
      data: perfilUsuario,
      message: "Perfil de usuario creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear perfil de usuario",
      error: error.message,
    });
  }
});

//Actualizar Perfil de usuario
/**
 * @swagger
 * /api/perfil-usuario/{id}:
 *   put:
 *     summary: Actualizar perfil de usuario
 *     description: Actualiza un perfil de usuario existente mediante su ID
 *     tags:
 *       - Perfil Usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del perfil de usuario a actualizar
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perfil:
 *                 type: string
 *                 description: Nuevo nombre del perfil de usuario
 *                 example: "Supervisor"
 *     responses:
 *       200:
 *         description: Perfil de usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 ID: 1
 *                 PERFIL: "Supervisor"
 *               message: "Perfil de usuario actualizado exitosamente"
 *       404:
 *         description: Perfil de usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Perfil de usuario no encontrado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al actualizar perfil de usuario"
 *               error: "Error details"
 */
routerPerfilUsuario.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const perfilUsuarioActualizado =
      await PerfilUsuarioService.actualizarPerfilUsuario(id, datosActualizados);

    if (!perfilUsuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: "Perfil de usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: perfilUsuarioActualizado,
      message: "Perfil de usuario actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar perfil de usuario",
      error: error.message,
    });
  }
});

//Eliminar perfil de usuario
/**
 * @swagger
 * /api/perfil-usuario/{id}:
 *   delete:
 *     summary: Eliminar perfil de usuario
 *     description: Elimina un perfil de usuario mediante su ID
 *     tags:
 *       - Perfil Usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del perfil de usuario a eliminar
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Perfil de usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               message: "Perfil de usuario eliminado exitosamente"
 *       404:
 *         description: Perfil de usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Perfil de usuario no encontrado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al eliminar perfil de usuario"
 *               error: "Error details"
 */
routerPerfilUsuario.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const perfilUsuarioEliminado =
      await PerfilUsuarioService.eliminarPerfilUsuario(id);

    if (!perfilUsuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: "Perfil de usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfil de usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar perfil de usuario",
      error: error.message,
    });
  }
});

export default routerPerfilUsuario;
