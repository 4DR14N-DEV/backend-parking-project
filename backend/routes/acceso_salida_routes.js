import express from "express";
import AccesoSalidaService from "../services/acceso_salida_service.js";
const routerAccesoSalida = express.Router();

//Listar todos los Accesos y salidas
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

//Obtener acceso/salida por ID
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

//Crear nuevo acceso/salida
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

//Actualizar acceso/salida
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

//Eliminar acceso/salida
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
