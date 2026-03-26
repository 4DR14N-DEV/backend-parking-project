import express from "express";
import IncidenciaService from "../services/incidencia_service.js";
const routerIncidencia = express.Router();

//Listar todas las incidencias
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

//Obtener incidencia por ID
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

//Crear nueva incidencia
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

//Actualizar incidencia
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

//Eliminar incidencia
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
