import express from "express";
import PerfilUsuarioService from "../services/perfil_usuario_service.js";
const routerPerfilUsuario = express.Router();

//Listar perfiles de usuario
routerPerfilUsuario.get("/", async (req, res) => {
  try {
    const perfilUsuarios = await PerfilUsuarioService.listarPerfilesUsuario();
    res.status(200).json({
      success: true,
      data: perfilUsuarios,
      message: "Perfiles de usuario obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los perfiles de usuario",
      error: error.message,
    });
  }
});

//Obtener perfil de usuario por ID
routerPerfilUsuario.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const perfilUsuario =
      await PerfilUsuarioService.obtenerPerfilUsuarioPorId(id);

    if (!perfilUsuario) {
      return res.status(404).json({
        success: false,
        message: "Perfil de usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: perfilUsuario,
      message: "Perfil de usuario obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil de usuario",
      error: error.message,
    });
  }
});

//Crear nuevo perfil de usuario
routerPerfilUsuario.post("/", async (req, res) => {
  try {
    const { perfil } = req.body;

    if (!perfil) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: perfil",
      });
    }

    const perfilUsuario = await PerfilUsuarioService.crearPerfilUsuario({
      perfil,
    });

    res.status(201).json({
      success: true,
      data: perfilUsuario,
      message: "Perfil de usuario creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear perfil de usuario",
      error: error.message,
    });
  }
});

//Actualizar Perfil de usuario
routerPerfilUsuario.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const perfilUsuarioActualizado =
      await PerfilUsuarioService.actualizarPerfilUsuario(id, datosActualizados);

    if (!perfilUsuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: "Perfil de usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: perfilUsuarioActualizado,
      message: "Perfil de usuario actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar perfil de usuario",
      error: error.message,
    });
  }
});

//Eliminar perfil de usuario
routerPerfilUsuario.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const perfilUsuarioEliminado =
      await PerfilUsuarioService.eliminarPerfilUsuario(id);

    if (!perfilUsuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: "Perfil de usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfil de usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar perfil de usuario",
      error: error.message,
    });
  }
});

export default routerPerfilUsuario;
