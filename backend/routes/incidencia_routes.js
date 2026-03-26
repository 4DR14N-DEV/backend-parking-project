import express from "express";
import IncidenciaService from "../services/incidencia_service.js";
const routerIncidencia = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Incidencia:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la incidencia
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre de la incidencia
 *           example: "Robo de vehículo"
 *     IncidenciaInput:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre de la incidencia
 *           example: "Choque"
 */

/**
 * @swagger
 * /api/incidencias:
 *   get:
 *     summary: Listar todas las incidencias
 *     description: Retorna una lista de todas las incidencias registradas
 *     tags: [Incidencias]
 *     responses:
 *       200:
 *         description: Lista de incidencias obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Incidencia'
 *                 message:
 *                   type: string
 *                   example: "Incidencias obtenidas exitosamente"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerIncidencia.get("/", async (req, res) => {
  try {
    const incidencias = await IncidenciaService.listarIncidencias();
    res.status(200).json({
      success: true,
      data: incidencias,
      message: "Incidencias obtenidas exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener incidencias",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/incidencias/{id}:
 *   get:
 *     summary: Obtener una incidencia por ID
 *     description: Retorna los datos de una incidencia específica
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la incidencia
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Incidencia obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Incidencia'
 *                 message:
 *                   type: string
 *                   example: "Incidencia obtenida exitosamente"
 *       404:
 *         description: Incidencia no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerIncidencia.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const incidencia = await IncidenciaService.obtenerIncidenciaPorId(id);

    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: "Incidencia no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: incidencia,
      message: "Incidencia obtenida exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener incidencia",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/incidencias:
 *   post:
 *     summary: Crear una nueva incidencia
 *     description: Registra una nueva incidencia en el sistema
 *     tags: [Incidencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidenciaInput'
 *     responses:
 *       201:
 *         description: Incidencia creada exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
routerIncidencia.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: nombre",
      });
    }

    const incidencia = await IncidenciaService.crearIncidencia({ nombre });

    res.status(201).json({
      success: true,
      data: incidencia,
      message: "Incidencia creada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear incidencia",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/incidencias/{id}:
 *   put:
 *     summary: Actualizar una incidencia
 *     description: Actualiza los datos de una incidencia existente
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la incidencia
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Incidencia actualizada exitosamente
 *       404:
 *         description: Incidencia no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerIncidencia.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const incidenciaActualizada = await IncidenciaService.actualizarIncidencia(
      id,
      datosActualizados,
    );
    if (!incidenciaActualizada) {
      return res.status(404).json({
        success: false,
        message: "Incidencia no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: incidenciaActualizada,
      message: "Incidencia actualizada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar incidencia",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/incidencias/{id}:
 *   delete:
 *     summary: Eliminar una incidencia
 *     description: Elimina una incidencia del sistema
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la incidencia
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Incidencia eliminada exitosamente
 *       404:
 *         description: Incidencia no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerIncidencia.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const incidenciaEliminada = await IncidenciaService.eliminarIncidencia(id);

    if (!incidenciaEliminada) {
      return res.status(404).json({
        success: false,
        message: "Incidencia no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Incidencia eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar incidencia",
      error: error.message,
    });
  }
});

export default routerIncidencia;