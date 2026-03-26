import express from "express";
import HistorialParqueoService from "../services/historial_parqueo_service.js";
const routerHistorialParqueo = express.Router();

//Listar todo el historial de parqueo
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
