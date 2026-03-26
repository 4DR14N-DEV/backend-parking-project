import express from "express";
import ReporteIncidenciaService from "../services/reporte_incidencia_service.js";
const routerReporteIncidencia = express.Router();

/**
 * @swagger
 * /api/reporte-incidencia:
 *   get:
 *     summary: Listar todos los reportes de incidencia
 *     description: Obtiene todos los registros de reportes de incidencia en el sistema
 *     tags:
 *       - Reporte Incidencia
 *     responses:
 *       200:
 *         description: Reportes de incidencias obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 - VEHICULO: 1
 *                   INCIDENCIA: 1
 *                   FECHAHORA: "2024-01-15T10:30:00Z"
 *               message: "Reportes de incidencias obtenidos exitosamente"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al obtener reportes de incidencias"
 *               error: "Error details"
 */
//Listar todos los reporte de incidencia
routerReporteIncidencia.get("/", async (req, res) => {
  try {
    const reportesIncidencias =
      await ReporteIncidenciaService.listarReporteIncidencia();
    res.status(200).json({
      success: true,
      data: reportesIncidencias,
      message: "Reportes de incidencias obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reportes de incidencias",
      error: error.message,
    });
  }
});

//Obtener reporte de incidencia por ID
/**
 * @swagger
 * /api/reporte-incidencia/vehiculo/{vehiculoId}/incidencia/{incidenciaId}:
 *   get:
 *     summary: Obtener reporte de incidencia por ID
 *     description: Obtiene un reporte de incidencia específico mediante los IDs de vehículo e incidencia
 *     tags:
 *       - Reporte Incidencia
 *     parameters:
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         description: ID del vehículo
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: incidenciaId
 *         required: true
 *         description: ID de la incidencia
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Reporte de incidencia obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 VEHICULO: 1
 *                 INCIDENCIA: 1
 *                 FECHAHORA: "2024-01-15T10:30:00Z"
 *               message: "Reporte de incidencia obtenido exitosamente"
 *       404:
 *         description: Reporte de incidencia no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Reporte de incidencia no encontrado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al obtener reporte de incidencia"
 *               error: "Error details"
 */
routerReporteIncidencia.get(
  "/vehiculo/:vehiculoId/incidencia/:incidenciaId",
  async (req, res) => {
    try {
      const vehiculoId = parseInt(req.params.vehiculoId);
      const incidenciaId = parseInt(req.params.incidenciaId);
      const reporteIncidencia =
        await ReporteIncidenciaService.obtenerReporteIncidencia(
          vehiculoId,
          incidenciaId,
        );

      if (!reporteIncidencia) {
        return res.status(404).json({
          success: false,
          message: "Reporte de incidencia no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: reporteIncidencia,
        message: "Reporte de incidencia obtenido exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener reporte de incidencia",
        error: error.message,
      });
    }
  },
);

// Crear nuevo reporte de incidencia|
/**
 * @swagger
 * /api/reporte-incidencia:
 *   post:
 *     summary: Crear nuevo reporte de incidencia
 *     description: Registra un nuevo reporte de incidencia en el sistema
 *     tags:
 *       - Reporte Incidencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehiculo
 *               - incidencia
 *               - fechaHora
 *             properties:
 *               vehiculo:
 *                 type: integer
 *                 description: ID del vehículo
 *                 example: 1
 *               incidencia:
 *                 type: integer
 *                 description: ID de la incidencia
 *                 example: 1
 *               fechaHora:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora del reporte
 *                 example: "2024-01-15T10:30:00Z"
 *     responses:
 *       201:
 *         description: Reporte de incidencia creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               data:
 *                 VEHICULO: 1
 *                 INCIDENCIA: 1
 *                 FECHAHORA: "2024-01-15T10:30:00Z"
 *               message: "Reporte de incidencia creado exitosamente"
 *       400:
 *         description: Datos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "faltan campos obligatorios: vehiculo, incidencia, fechaHora"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al crear reporte de incidencia"
 *               error: "Error details"
 */
routerReporteIncidencia.post("/", async (req, res) => {
  try {
    const { vehiculo, incidencia, fechaHora } = req.body;

    if (!vehiculo || !incidencia || !fechaHora) {
      return res.status(400).json({
        success: false,
        message: "faltan campos obligatorios: vehiculo, incidencia, fechaHora",
      });
    }

    const reporteIncidencia =
      await ReporteIncidenciaService.crearReporteIncidencia({
        vehiculo,
        incidencia,
        fechaHora,
      });

    res.status(201).json({
      success: true,
      data: reporteIncidencia,
      message: "Reporte de incidencia creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear reporte de incidencia",
      error: error.message,
    });
  }
});

//Eliminar reporte de incidencia
/**
 * @swagger
 * /api/reporte-incidencia/vehiculo/{vehiculoId}/incidencia/{incidenciaId}:
 *   delete:
 *     summary: Eliminar reporte de incidencia
 *     description: Elimina un reporte de incidencia mediante los IDs de vehículo e incidencia
 *     tags:
 *       - Reporte Incidencia
 *     parameters:
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         description: ID del vehículo
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: incidenciaId
 *         required: true
 *         description: ID de la incidencia
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Reporte de incidencia eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               message: "Reporte de incidencia eliminado exitosamente"
 *       404:
 *         description: Reporte de incidencia no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Reporte de incidencia no encontrado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: false
 *               message: "Error al eliminar reporte de incidencia"
 *               error: "Error details"
 */
routerReporteIncidencia.delete(
  "/vehiculo/:vehiculoId/incidencia/:incidenciaId",
  async (req, res) => {
    try {
      const vehiculoId = parseInt(req.params.vehiculoId);
      const incidenciaId = parseInt(req.params.incidenciaId);
      const reporteIncidenciaEliminado =
        await ReporteIncidenciaService.eliminarReporteIncidencia(
          vehiculoId,
          incidenciaId,
        );

      if (!reporteIncidenciaEliminado) {
        return res.status(404).json({
          success: false,
          message: "Reporte de incidencia no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Reporte de incidencia eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar reporte de incidencia",
        error: error.message,
      });
    }
  },
);

export default routerReporteIncidencia;
