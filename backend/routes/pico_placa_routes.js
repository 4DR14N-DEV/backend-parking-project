import express from "express";
import PicoPlacaService from "../services/pico_placa_service.js";
const routerPicoPlaca = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PicoPlaca:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único
 *           example: 1
 *         tipoVehiculo:
 *           type: string
 *           description: Tipo de vehículo (Carro, Moto)
 *           enum: [Carro, Moto]
 *           example: "Carro"
 *         numero:
 *           type: string
 *           description: Último dígito del vehículo
 *           example: "1"
 *         dia:
 *           type: string
 *           description: Día de restricción (Lunes, Martes, etc.)
 *           enum: [Lunes, Martes, Miercoles, Jueves, Viernes]
 *           example: "Lunes"
 *     PicoPlacaInput:
 *       type: object
 *       required:
 *         - tipoVehiculo
 *         - numero
 *         - dia
 *       properties:
 *         tipoVehiculo:
 *           type: string
 *           enum: [Carro, Moto]
 *         numero:
 *           type: string
 *         dia:
 *           type: string
 *           enum: [Lunes, Martes, Miercoles, Jueves, Viernes]
 */

/**
 * @swagger
 * /api/pico-y-placa:
 *   get:
 *     summary: Listar todas las restricciones pico y placa
 *     description: Retorna todas las restricciones de pico y placa del sistema
 *     tags: [Pico y Placa]
 *     responses:
 *       200:
 *         description: Lista obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
routerPicoPlaca.get("/", async (req, res) => {
  try {
    const picoPlacas = await PicoPlacaService.listarPicoPlaca();
    res.status(200).json({
      success: true,
      data: picoPlacas,
      message: "Pico y placa obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pico y placas",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/pico-y-placa/{id}:
 *   get:
 *     summary: Obtener una restricción pico y placa por ID
 *     tags: [Pico y Placa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restricción obtenida exitosamente
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerPicoPlaca.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const picoPlaca = await PicoPlacaService.obtenerPicoPlacaPorId(id);
    if (!picoPlaca) {
      return res.status(404).json({
        success: false,
        message: "Pico y placa no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: picoPlaca,
      message: "Pico y placa obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pico y placa",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/pico-y-placa:
 *   post:
 *     summary: Crear nueva restricción pico y placa
 *     tags: [Pico y Placa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PicoPlacaInput'
 *     responses:
 *       201:
 *         description: Creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
routerPicoPlaca.post("/", async (req, res) => {
  try {
    const { tipoVehiculo, numero, dia } = req.body;

    if (!tipoVehiculo || !numero || !dia) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: tipoVehiculo, numero, dia",
      });
    }

    const picoPlaca = await PicoPlacaService.crearPicoPlaca({
      tipoVehiculo,
      numero,
      dia,
    });

    res.status(201).json({
      success: true,
      data: picoPlaca,
      message: "Pico y placa creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear pico y placa",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/pico-y-placa/{id}:
 *   put:
 *     summary: Actualizar restricción pico y placa
 *     tags: [Pico y Placa]
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
 *               tipoVehiculo:
 *                 type: string
 *               numero:
 *                 type: string
 *               dia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actualizado exitosamente
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerPicoPlaca.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const PicoPlacaActualizado = await PicoPlacaService.actualizarPicoPlaca(
      id,
      datosActualizados,
    );

    if (!PicoPlacaActualizado) {
      return res.status(404).json({
        success: false,
        message: "Pico y placa no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: PicoPlacaActualizado,
      message: "Pico y placa actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar pico y placa",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/pico-y-placa/{id}:
 *   delete:
 *     summary: Eliminar restricción pico y placa
 *     tags: [Pico y Placa]
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
routerPicoPlaca.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const picoPlacaEliminado = await PicoPlacaService.eliminarPicoPlaca(id);

    if (!picoPlacaEliminado) {
      return res.status(404).json({
        success: false,
        message: "Pico y placa no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pico y placa eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar pico y placa",
      error: error.message,
    });
  }
});

export default routerPicoPlaca;