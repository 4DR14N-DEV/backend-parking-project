import express from "express";
import AccesoSalidaService from "../services/acceso_salida_service.js";
const routerAccesoSalida = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AccesoSalida:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del registro
 *           example: 1
 *         movimiento:
 *           type: string
 *           description: Tipo de movimiento (Entrada, Salida)
 *           enum: [Entrada, Salida]
 *           example: "Entrada"
 *         fechaHora:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del movimiento
 *           example: "2025-04-06T19:22:53.000Z"
 *         puerta:
 *           type: string
 *           description: Puerta de acceso
 *           example: "Puerta 1"
 *         tiempoEstadia:
 *           type: integer
 *           description: Tiempo de estadía en segundos
 *           example: 3600
 *         vehiculo:
 *           type: integer
 *           description: ID del vehículo
 *           example: 1
 *     AccesoSalidaInput:
 *       type: object
 *       required:
 *         - movimiento
 *         - fechaHora
 *         - puerta
 *         - tiempoEstadia
 *         - vehiculo
 *       properties:
 *         movimiento:
 *           type: string
 *           enum: [Entrada, Salida]
 *         fechaHora:
 *           type: string
 *           format: date-time
 *         puerta:
 *           type: string
 *         tiempoEstadia:
 *           type: integer
 *         vehiculo:
 *           type: integer
 */

/**
 * @swagger
 * /api/accesos-salidas:
 *   get:
 *     summary: Listar todos los accesos y salidas
 *     description: Retorna el historial completo de ingresos y salidas de vehículos
 *     tags: [Accesos y Salidas]
 *     responses:
 *       200:
 *         description: Lista de accesos/salidas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/AccesoSalida'
 *                 message:
 *                   type: string
 *                   example: "Accesos/salidas obtenidos exitosamente"
 *       500:
 *         description: Error interno del servidor
 */
routerAccesoSalida.get("/", async (req, res) => {
  try {
    const accesosSalidas = await AccesoSalidaService.listarAccesoSalida();
    res.status(200).json({
      success: true,
      data: accesosSalidas,
      message: "Accesos/salidas obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al listar accesos/salidas",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/accesos-salidas/{id}:
 *   get:
 *     summary: Obtener un registro de acceso/salida por ID
 *     tags: [Accesos y Salidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro obtenido exitosamente
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerAccesoSalida.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const accesoSalida = await AccesoSalidaService.obtenerAccesoSalidaPorId(id);

    if (!accesoSalida) {
      return res.status(404).json({
        success: false,
        message: "Acceso/salida no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: accesoSalida,
      message: "Acceso/salida obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener acceso/salida",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/accesos-salidas:
 *   post:
 *     summary: Registrar un nuevo acceso/salida
 *     description: Registra la entrada o salida de un vehículo del parqueadero
 *     tags: [Accesos y Salidas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccesoSalidaInput'
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
routerAccesoSalida.post("/", async (req, res) => {
  try {
    const { movimiento, fechaHora, puerta, tiempoEstadia, vehiculo } = req.body;
    if (!movimiento || !fechaHora || !puerta || !tiempoEstadia || !vehiculo) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos obligatorios: movimiento, fechaHora, puerta, tiempoEstadia, vehiculo",
      });
    }

    const accesoSalida = await AccesoSalidaService.crearAccesoSalida({
      movimiento,
      fechaHora,
      puerta,
      tiempoEstadia,
      vehiculo,
    });
    res.status(201).json({
      success: true,
      data: accesoSalida,
      message: "Acceso/salida creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear acceso/salida",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/accesos-salidas/{id}:
 *   put:
 *     summary: Actualizar un registro de acceso/salida
 *     tags: [Accesos y Salidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movimiento:
 *                 type: string
 *               fechaHora:
 *                 type: string
 *               puerta:
 *                 type: string
 *               tiempoEstadia:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Actualizado exitosamente
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerAccesoSalida.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const accesoSalida = await AccesoSalidaService.actualizarAccesoSalida(
      id,
      datosActualizados,
    );

    if (!accesoSalida) {
      return res.status(404).json({
        success: false,
        message: "Acceso/salida no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: accesoSalida,
      message: "Acceso/salida actualizado con exito",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar acceso/salida",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/accesos-salidas/{id}:
 *   delete:
 *     summary: Eliminar un registro de acceso/salida
 *     tags: [Accesos y Salidas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado exitosamente
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerAccesoSalida.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const accesoSalidaEliminado =
      await AccesoSalidaService.eliminarAccesoSalida(id);

    if (!accesoSalidaEliminado) {
      return res.status(404).json({
        success: false,
        message: "Acceso/salida no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Acceso/salida eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar acceso/salida",
      error: error.message,
    });
  }
});

export default routerAccesoSalida;