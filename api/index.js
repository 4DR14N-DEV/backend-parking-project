import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import db from "../backend/config/PostgreSQLDatabase.js";
import routerUsuario from "../backend/routes/usuario_routes.js";
import routerVehiculo from "../backend/routes/vehiculo_routes.js";
import routerAccesoSalida from "../backend/routes/acceso_salida_routes.js";
import routerCelda from "../backend/routes/celda_routes.js";
import routerHistorialParqueo from "../backend/routes/historial_parqueo_routes.js";
import routerIncidencia from "../backend/routes/incidencia_routes.js";
import routerPerfilUsuario from "../backend/routes/perfil_usuario_routes.js";
import routerPicoPlaca from "../backend/routes/pico_placa_routes.js";
import routerReporteIncidencia from "../backend/routes/reporte_incidencia_routes.js";

const app = express();
const PORT = process.env.PORT || process.env.VERCEL_PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Parking Lot Management API",
      version: "1.0.0",
      description: `
## 📋 Descripción
API REST para la gestión integral de un sistema de parqueadero. Proporciona endpoints para la administración de usuarios, vehículos, celdas de estacionamiento, control de accesos y salidas, gestión de incidencias y reportes.

## 🎯 Características Principales
- **Gestión de Usuarios**: CRUD completo con diferentes perfiles (administrador, operador, usuario)
- **Control de Vehículos**: Registro y gestión de vehículos asociados a usuarios
- **Administración de Celdas**: Control de disponibilidad de espacios de estacionamiento
- **Historial de Parqueo**: Seguimiento completo de ingresos y salidas de vehículos
- **Pico y Placa**: Sistema de restricciones vehiculares por día y número
- **Gestión de Incidencias**: Registro y seguimiento de incidentes en el parqueadero

## 🔐 Autenticación
Actualmente la API utiliza autenticación básica. Se recomienda implementar JWT en futuras versiones.

## 📝 Convenciones
- Los nombres de tablas en PostgreSQL deben estar en MAYÚSCULAS
- Las respuestas siguen un formato estándar con estructura: \`{ success, data, message }\`
- Los códigos de estado HTTP: 200 (OK), 201 (Creado), 400 (Error de validación), 404 (No encontrado), 500 (Error interno)
      `,
      contact: {
        name: "API Support",
        email: "adrianrpo23@gmail.com",
        url: "https://github.com/4DR14N-DEV/backend-parking-project"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desarrollo local"
      },
      {
        url: "https://backend-parking-project-v10.vercel.app",
        description: "Servidor de producción (Vercel)"
      }
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error al obtener usuarios" },
            error: { type: "string", example: "relation \"USUARIO\" does not exist" }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
            message: { type: "string", example: "Operación exitosa" }
          }
        }
      }
    },
    tags: [
      { name: "Usuarios", description: "Gestión de usuarios del sistema" },
      { name: "Vehículos", description: "Administración de vehículos" },
      { name: "Celdas", description: "Control de espacios de estacionamiento" },
      { name: "Accesos y Salidas", description: "Registro de ingresos y salidas" },
      { name: "Historial de Parqueo", description: "Seguimiento de estacionamiento" },
      { name: "Incidencias", description: "Gestión de incidentes" },
      { name: "Perfiles de Usuario", description: "Roles y permisos" },
      { name: "Pico y Placa", description: "Restricciones vehiculares" },
      { name: "Reportes de Incidencias", description: "Reportes de incidentes" }
    ]
  },
  apis: [path.resolve(process.cwd(), "../backend/routes/*.js")], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Rutas alternativas para documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      // Dominios de Vercel (se会自动匹配 *.vercel.app)
      /\.vercel\.app$/,
      /\.vercel\.app$/,
      // Dominios de Supabase
      /\.supabase\.co$/,
      // Tu dominio personalizado si lo tenés
    ];
    
    // Permitir solicitudes sin origen (como Postman/curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar si el origen está en la lista o coincide con algún patrón
    const isAllowed = allowedOrigins.some(allowed => 
      allowed === origin || (allowed instanceof RegExp && allowed.test(origin))
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`❌ CORS bloqueado para origen: ${origin}`);
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/usuarios", routerUsuario);
app.use("/api/vehiculos", routerVehiculo);
app.use("/api/celdas", routerCelda);
app.use("/api/accesos-salidas", routerAccesoSalida);
app.use("/api/historial-parqueo", routerHistorialParqueo);
app.use("/api/incidencias", routerIncidencia);
app.use("/api/perfil-usuarios", routerPerfilUsuario);
app.use("/api/pico-y-placa", routerPicoPlaca);
app.use("/api/reporte-incidencias", routerReporteIncidencia);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de PARQUEADERO - Backend funcionando exitosamente",
    documentation: {
      swagger_ui: "http://localhost:" + PORT + "/api-docs",
      swagger_ui_alt: "http://localhost:" + PORT + "/api/docs",
      production_swagger: "https://backend-parking-project-v10.vercel.app/api-docs",
      production_swagger_alt: "https://backend-parking-project-v10.vercel.app/api/docs"
    },
    endpoints: {
      //usuarios
      "GET /api/usuarios": "Listar todos los usuarios",
      "GET /api/usuarios/:id": "Obtener un usuario por ID",
      "POST /api/usuarios": "Crear un nuevo usuario",
      "PUT /api/usuarios/:id": "Actualizar un usuario",
      "DELETE /api/usuarios/:id": "Eliminar un usuario",
      //vehiculos
      "GET /api/vehiculos": "Listar todos los vehiculos",
      "GET /api/vehiculos/:id": "Obtener un vehiculo por ID",
      "POST /api/vehiculos": "Crear un nuevo vehiculo",
      "PUT /api/vehiculos/:id": "Actualizar un vehiculo",
      "DELETE /api/vehiculos/:id": "Eliminar un vehiculo",
      //Celdas
      "GET /api/celdas": "Listar todos los celdas",
      "GET /api/celdas/:id": "Obtener un celda por ID",
      "POST /api/celdas": "Crear un nuevo celda",
      "PUT /api/celdas/:id": "Actualizar un celda",
      "DELETE /api/celdas/:id": "Eliminar un celda",
      //Accesos y Salidas
      "GET /api/accesos-salidas": "Listar todos los acceso y salidas",
      "GET /api/accesos-salidas/:id": "Obtener un acceso o salida por ID",
      "POST /api/accesos-salidas": "Crear un nuevo acceso o salida",
      "PUT /api/accesos-salidas/:id": "Actualizar un acceso o salida",
      "DELETE /api/accesos-salidas/:id": "Eliminar un acceso o salida",
      //Historial de Parqueos
      "GET /api/historial-parqueo": "Listar todos los historiales de parqueo",
      "GET /api/historial-parqueo/celda/:celdaId/vehiculo/:vehiculoId":
        "Obtener un historial de parqueo exacto",
      "POST /api/historial-parqueo": "Crear un nuevo historial de parqueo",
      "DELETE /api/historial-parqueo/celda/:celdaId/vehiculo/:vehiculoId":
        "Eliminar un historial de parqueo",
      //Incidencias
      "GET /api/incidencias": "Listar todas las incidencias",
      "GET /api/incidencias/:id": "Obtener una incidencia por ID",
      "POST /api/incidencias": "Crear una nueva incidencia",
      "PUT /api/incidencias/:id": "Actualizar una incidencia",
      "DELETE /api/incidencias/:id": "Eliminar una incidencia",
      //perfiles de usuario
      "GET /api/perfil-usuarios": "Listar todos los perfiles de usuario",
      "GET /api/perfil-usuarios/:id": "Obtener un perfil de usuario por ID",
      "POST /api/perfil-usuarios": "Crear un nuevo perfil de usuario",
      "PUT /api/perfil-usuarios/:id": "Actualizar un perfil de usuario",
      "DELETE /api/perfil-usuarios/:id": "Eliminar un perfil de usuario",
      //Pico y placa
      "GET /api/pico-y-placa": "Listar todos los pico y placa",
      "GET /api/pico-y-placa/:id": "Obtener un pico y placa por ID",
      "POST /api/pico-y-placa": "Crear un nuevo pico y placa",
      "PUT /api/pico-y-placa/:id": "Actualizar un pico y placa",
      "DELETE /api/pico-y-placa/:id": "Eliminar un pico y placa",
      //Reporte de incidecnias
      "GET /api/reporte-incidencias": "Listar todos los reportes de incidencia",
      "GET /api/reporte-incidencias/vehiculo/:vehiculoId/incidencia/:incidenciaId":
        "Obtener un reporte de incidencia exacto",
      "POST /api/reporte-incidencias": "Crear un nuevo reporte de incidencia",
      "PUT /api/reporte-incidencias/vehiculo/:vehiculoId/incidencia/:incidenciaId":
        "Actualizar un reporte de incidencia",
      "DELETE /api/reporte-incidencias/vehiculo/:vehiculoId/incidencia/:incidenciaId":
        "Eliminar un reporte de incidencia",
    },
  });
});

// Iniciar servidor
if (!process.env.VERCEL) {
  (async () => {
    try {
      await db.connect();
      console.log("✓ Base de datos conectada");
    } catch (error) {
      console.error("⚠ Error al conectar base de datos:", error.message);
    }
    
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`✓ API disponible en http://localhost:${PORT}/api`);
    });
  })();
} else {
  // En Vercel, intentar conectar pero no bloquear
  db.connect().catch(err => {
    console.error("⚠ Error al conectar base de datos en Vercel:", err.message);
  });
}

// Exportar para Vercel
export default app;
