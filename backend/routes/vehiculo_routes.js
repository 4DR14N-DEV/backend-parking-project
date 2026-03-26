import express from "express";
import VehiculoService from "../services/vehiculo_service.js";
const routerVehiculo = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehiculo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del vehículo
 *           example: 1
 *         placa:
 *           type: string
 *           description: Placa del vehículo
 *           example: "ABC123"
 *         color:
 *           type: string
 *           description: Color del vehículo
 *           example: "rojo"
 *         modelo:
 *           type: string
 *           description: Modelo del vehículo (año)
 *           example: "2020"
 *         marca:
 *           type: string
 *           description: Marca del vehículo
 *           example: "Toyota"
 *         tipo:
 *           type: string
 *           description: Tipo de vehículo (Carro, Moto)
 *           enum: [Carro, Moto]
 *           example: "Carro"
 *         usuario:
 *           type: integer
 *           description: ID del usuario propietario
 *           example: 1
 *     VehiculoInput:
 *       type: object
 *       required:
 *         - tipo
 *         - placa
 *         - color
 *         - modelo
 *         - marca
 *         - usuario
 *       properties:
 *         tipo:
 *           type: string
 *           description: Tipo de vehículo
 *           enum: [Carro, Moto]
 *           example: "Carro"
 *         placa:
 *           type: string
 *           description: Placa del vehículo
 *           example: "XYZ987"
 *         color:
 *           type: string
 *           description: Color del vehículo
 *           example: "azul"
 *         modelo:
 *           type: string
 *           description: Año del modelo
 *           example: "2022"
 *         marca:
 *           type: string
 *           description: Marca del vehículo
 *           example: "Honda"
 *         usuario:
 *           type: integer
 *           description: ID del usuario propietario
 *           example: 1
 */

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Listar todos los vehículos
 *     description: Retorna una lista de todos los vehículos registrados en el sistema
 *     tags: [Vehículos]
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Vehiculo'
 *                 message:
 *                   type: string
 *                   example: "Vehiculos obtenidos exitosamente"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerVehiculo.get("/", async (req, res) => {
  try {
    const vehiculos = await VehiculoService.listarVehiculos();
    res.status(200).json({
      success: true,
      data: vehiculos,
      message: "Vehiculos obtenidos exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener vehiculos",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener un vehículo por ID
 *     description: Retorna los datos de un vehículo específico según su ID
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del vehículo
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Vehículo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Vehiculo'
 *                 message:
 *                   type: string
 *                   example: "Vehiculo obtenido exitosamente"
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Vehiculo no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerVehiculo.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const vehiculo = await VehiculoService.obtenerVehiculoPorId(id);

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: "Vehiculo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: vehiculo,
      message: "Vehiculo obtenido exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener vehiculo",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear un nuevo vehículo
 *     description: Registra un nuevo vehículo en el sistema
 *     tags: [Vehículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehiculoInput'
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Vehiculo'
 *                 message:
 *                   type: string
 *                   example: "Vehiculo creado exitosamente"
 *       400:
 *         description: Error de validación - campos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Se requiere campos obligatorios: tipo, placa, color, modelo, marca, usuario"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerVehiculo.post("/", async (req, res) => {
  try {
    const { tipo, placa, color, modelo, marca, usuario } = req.body;

    if (!tipo || !placa || !color || !modelo || !marca || !usuario) {
      return res.status(400).json({
        success: false,
        message:
          "Se requiere campos obligatorios: tipo, placa, color, modelo, marca, usuario",
      });
    }

    const vehiculo = await VehiculoService.crearVehiculo({
      tipo,
      placa,
      color,
      modelo,
      marca,
      usuario,
    });

    res.status(201).json({
      success: true,
      data: vehiculo,
      message: "Vehiculo creado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear vehiculo",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar un vehículo
 *     description: Actualiza los datos de un vehículo existente
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del vehículo a actualizar
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *               placa:
 *                 type: string
 *               color:
 *                 type: string
 *               modelo:
 *                 type: string
 *               marca:
 *                 type: string
 *               usuario:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Vehiculo'
 *                 message:
 *                   type: string
 *                   example: "Vehiculo actualizado exitosamente"
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Vehiculo no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerVehiculo.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    const vehiculoActualizado = await VehiculoService.actualizarVehiculo(
      id,
      datosActualizados,
    );

    if (!vehiculoActualizado) {
      return res.status(404).json({
        success: false,
        message: "Vehiculo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: vehiculoActualizado,
      message: "Vehiculo actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar vehiculo",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar un vehículo
 *     description: Elimina un vehículo del sistema
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del vehículo a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Vehículo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vehiculo eliminado exitosamente"
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Vehiculo no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
routerVehiculo.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const vehiculoEliminado = await VehiculoService.eliminarVehiculo(id);

    if (!vehiculoEliminado) {
      return res.status(404).json({
        success: false,
        message: "Vehiculo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehiculo eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar vehiculo",
      error: error.message,
    });
  }
});

export default routerVehiculo;