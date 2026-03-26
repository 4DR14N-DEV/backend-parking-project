import express from "express";
import HistorialParqueoService from "../services/historial_parqueo_service.js";
const routerHistorialParqueo = express.Router();

/**
 * @swagger
 * /api/historial-parqueo:
 *   get:
 *     summary: Listar todo el historial de parqueo
 *     description: Obtiene todos los registros del historial de parqueo en el sistema
 *     tags:
 *       - Historial Parqueo
 *     responses:
 *       200:
 *         description: Historial de parqueos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 - CELDA: 1
 *                   VEHICULO: 1
 *                   FECHAHORA: "2024-01-15T10:30:00Z"
 *               message: "Historial de parqueos obtenidos exitosamente"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al obtener historial de parqueos"
 *               error: "Error details"
 */
routerHistorialParqueo.get("/", async (req, res) => {
  try {
    const historialParqueos = await HistorialParqueoService.listarHistorial();
    res.status(200).json({
      success: true,
      data: historialParqueos,
      message: "Historial de parqueos obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener historial de parqueos",
      error: error.message,
    });
  }
});

//Obtener historial de parqueo por ID
/**
 * @swagger
 * /api/historial-parqueo/celda/{celdaId}/vehiculo/{vehiculoId}:
 *   get:
 *     summary: Obtener historial de parqueo por ID
 *     description: Obtiene un registro específico del historial de parqueo mediante los IDs de celda y vehículo
 *     tags:
 *       - Historial Parqueo
 *     parameters:
 *       - in: path
 *         name: celdaId
 *         required: true
 *         description: ID de la celda de parqueo
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         description: ID del vehículo
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Historial de parqueo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 CELDA: 1
 *                 VEHICULO: 1
 *                 FECHAHORA: "2024-01-15T10:30:00Z"
 *               message: "Historial de parqueo obtenido exitosamente"
 *       404:
 *         description: Historial de parqueo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Historial de parqueo no encontrado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al obtener historial de parqueo"
 *               error: "Error details"
 */
routerHistorialParqueo.get(
  "/celda/:celdaId/vehiculo/:vehiculoId",
  async (req, res) => {
    try {
      const celdaId = parseInt(req.params.celdaId);
      const vehiculoId = parseInt(req.params.vehiculoId);
      const historialParqueo = await HistorialParqueoService.obtenerHistorial(
        celdaId,
        vehiculoId,
      );

      if (!historialParqueo) {
        return res.status(404).json({
          success: false,
          message: "Historial de parqueo no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: historialParqueo,
        message: "Historial de parqueo obtenido exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener historial de parqueo",
        error: error.message,
      });
    }
  },
);

//Crear nuevo historial de parqueo
/**
 * @swagger
 * /api/historial-parqueo:
 *   post:
 *     summary: Crear nuevo historial de parqueo
 *     description: Registra un nuevo historial de parqueo en el sistema
 *     tags:
 *       - Historial Parqueo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - celda
 *               - vehiculo
 *               - fechaHora
 *             properties:
 *               celda:
 *                 type: integer
 *                 description: ID de la celda de parqueo
 *                 example: 1
 *               vehiculo:
 *                 type: integer
 *                 description: ID del vehículo
 *                 example: 1
 *               fechaHora:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora del parqueo
 *                 example: "2024-01-15T10:30:00Z"
 *     responses:
 *       201:
 *         description: Historial de parqueo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 CELDA: 1
 *                 VEHICULO: 1
 *                 FECHAHORA: "2024-01-15T10:30:00Z"
 *               message: "Historial de parqueo creado exitosamente"
 *       400:
 *         description: Datos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios: celda, vehiculo, fechaHora"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al crear historial de parqueo"
 *               error: "Error details"
 */
routerHistorialParqueo.post("/", async (req, res) => {
  try {
    const { celda, vehiculo, fechaHora } = req.body;

    if (!celda || !vehiculo || !fechaHora) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: celda, vehiculo, fechaHora",
      });
    }

    const historialParqueo =
      await HistorialParqueoService.crearHistorialParqueo({
        celda,
        vehiculo,
        fechaHora,
      });

    res.status(201).json({
      success: true,
      data: historialParqueo,
      message: "Historial de parqueo creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear historial de parqueo",
      error: error.message,
    });
  }
});

//Eliminar historial de parqueo
/**
 * @swagger
 * /api/historial-parqueo/celda/{celdaId}/vehiculo/{vehiculoId}:
 *   delete:
 *     summary: Eliminar historial de parqueo
 *     description: Elimina un registro del historial de parqueo mediante los IDs de celda y vehículo
 *     tags:
 *       - Historial Parqueo
 *     parameters:
 *       - in: path
 *         name: celdaId
 *         required: true
 *         description: ID de la celda de parqueo
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         description: ID del vehículo
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Historial de parqueo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               message: "Historial de parqueo eliminado exitosamente"
 *       404:
 *         description: Historial de parqueo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Historial de parqueo no encontrado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al eliminar historial de parqueo"
 *               error: "Error details"
 */
routerHistorialParqueo.delete(
  "/celda/:celdaId/vehiculo/vehiculoId",
  async (req, res) => {
    try {
      const celdaId = parseInt(req.params.celdaId);
      const vehiculoId = parseInt(req.params.vehiculoId);
      const historialParqueoEliminado =
        await HistorialParqueoService.eliminarHistorial(celdaId, vehiculoId);

      if (!historialParqueoEliminado) {
        return res.status(404).json({
          success: false,
          message: "Historial de parqueo no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Historial de parqueo eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar historial de parqueo",
        error: error.message,
      });
    }
  },
);

export default routerHistorialParqueo;
