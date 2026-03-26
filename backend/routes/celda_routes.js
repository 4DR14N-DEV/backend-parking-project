import express from "express";
import CeldaService from "../services/celda_service.js";
const routerCelda = express.Router();

//Listar todas las celdas
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

//Obtener celda por ID
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

//Crear nueva celda
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

//Actualizar celda
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

//Eliminar celda
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
