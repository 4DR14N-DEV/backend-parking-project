import express from "express";
import CeldaService from "../services/celda_service.js";
const routerCelda = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Celda:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la celda
 *           example: 1
 *         tipo:
 *           type: string
 *           description: Tipo de celda (Carro, Moto)
 *           enum: [Carro, Moto]
 *           example: "Carro"
 *         estado:
 *           type: string
 *           description: Estado de la celda (Libre, Ocupada)
 *           enum: [Libre, Ocupada]
 *           example: "Libre"
 *     CeldaInput:
 *       type: object
 *       required:
 *         - tipo
 *         - estado
 *       properties:
 *         tipo:
 *           type: string
 *           description: Tipo de celda
 *           enum: [Carro, Moto]
 *           example: "Carro"
 *         estado:
 *           type: string
 *           description: Estado de la celda
 *           enum: [Libre, Ocupada]
 *           example: "Libre"
 */

/**
 * @swagger
 * /api/celdas:
 *   get:
 *     summary: Listar todas las celdas
 *     description: Retorna una lista de todas las celdas de estacionamiento
 *     tags: [Celdas]
 *     responses:
 *       200:
 *         description: Lista de celdas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Celda'
 *                 message:
 *                   type: string
 *                   example: "Celdas obtenidas exitosamente"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerCelda.get("/", async (req, res) => {
  try {
    const celdas = await CeldaService.listarCeldas();
    res.status(200).json({
      success: true,
      data: celdas,
      message: "Celdas obtenidas exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener celdas",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/celdas/{id}:
 *   get:
 *     summary: Obtener una celda por ID
 *     description: Retorna los datos de una celda específica
 *     tags: [Celdas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la celda
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Celda obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Celda'
 *                 message:
 *                   type: string
 *                   example: "Celda obtenida exitosamente"
 *       404:
 *         description: Celda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerCelda.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const celda = await CeldaService.obtenerCeldaPorId(id);

    if (!celda) {
      return res.status(404).json({
        success: false,
        message: "Celda no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: celda,
      message: "Celda obtenida exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener celda",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/celdas:
 *   post:
 *     summary: Crear una nueva celda
 *     description: Registra una nueva celda de estacionamiento
 *     tags: [Celdas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CeldaInput'
 *     responses:
 *       201:
 *         description: Celda creada exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
routerCelda.post("/", async (req, res) => {
  try {
    const { tipo, estado } = req.body;

    if (!tipo || !estado) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: tipo, estado",
      });
    }

    const celda = await CeldaService.crearCelda({ tipo, estado });
    res.status(201).json({
      success: true,
      data: celda,
      message: "Celda creada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear celda",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/celdas/{id}:
 *   put:
 *     summary: Actualizar una celda
 *     description: Actualiza los datos de una celda existente
 *     tags: [Celdas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la celda
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Celda actualizada exitosamente
 *       404:
 *         description: Celda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerCelda.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const celdaActualizada = await CeldaService.actualizarCelda(
      id,
      datosActualizados,
    );

    if (!celdaActualizada) {
      return res.status(404).json({
        success: false,
        message: "Celda no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: celdaActualizada,
      message: "Celda actualizada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar celda",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/celdas/{id}:
 *   delete:
 *     summary: Eliminar una celda
 *     description: Elimina una celda del sistema
 *     tags: [Celdas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la celda
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Celda eliminada exitosamente
 *       404:
 *         description: Celda no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerCelda.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const celdaEliminada = await CeldaService.eliminarCelda(id);

    if (!celdaEliminada) {
      return res.status(404).json({
        success: false,
        message: "Celda no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Celda eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar celda",
      error: error.message,
    });
  }
});

export default routerCelda;