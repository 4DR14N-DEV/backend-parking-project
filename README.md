# Parking Lot Management API

API REST para la gestión integral de un sistema de parqueadero. Proporciona endpoints para la administración de usuarios, vehículos, celdas de estacionamiento, control de accesos y salidas, gestión de incidencias y reportes.

## Características Principales

- **Gestión de Usuarios**: CRUD completo con diferentes perfiles (administrador, operador, usuario)
- **Control de Vehículos**: Registro y gestión de vehículos asociados a usuarios
- **Administración de Celdas**: Control de disponibilidad de espacios de estacionamiento
- **Historial de Parqueo**: Seguimiento completo de ingresos y salidas de vehículos
- **Pico y Placa**: Sistema de restricciones vehiculares por día y número
- **Gestión de Incidencias**: Registro y seguimiento de incidentes en el parqueadero
- **Documentación Swagger**: API completamente documentada y probable

## Tecnologías

- **Backend**: Node.js con Express.js
- **Base de Datos**: PostgreSQL (alojado en Supabase)
- **Documentación**: Swagger/OpenAPI 3.0
- **Despliegue**: Vercel
- **Testing**: Jest

## Requisitos Previos

- Node.js 18.0.0 o superior
- NPM o Yarn
- Cuenta de Supabase (para la base de datos)
- Cuenta de Vercel (para el despliegue)

## Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/4DR14N-DEV/backend-parking-project.git
cd backend-parking-project
```

1. **Instalar dependencias**

```bash
npm install
```

1. **Configurar variables de entorno**
Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos PostgreSQL (Supabase)
DATABASE_URL=postgresql://[username]:[password]@host:port/database

# Puerto del servidor
PORT=3000
```

1. **Ejecutar el servidor en desarrollo**

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
├── api/
│   └── index.js           # Punto de entrada de la aplicación
├── backend/
│   ├── config/            # Configuración de base de datos
│   │   ├── PostgreSQLDatabase.js
│   │   └── database.js
│   ├── models/            # Modelos de datos
│   ├── routes/            # Rutas de la API
│   ├── services/          # Lógica de negocio
│   └── test/              # Pruebas unitarias
├── package.json
└── vercel.json            # Configuración de despliegue Vercel
```

## API Endpoints

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Listar todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear nuevo usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

### Vehículos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/vehiculos` | Listar todos los vehículos |
| GET | `/api/vehiculos/:id` | Obtener vehículo por ID |
| POST | `/api/vehiculos` | Crear nuevo vehículo |
| PUT | `/api/vehiculos/:id` | Actualizar vehículo |
| DELETE | `/api/vehiculos/:id` | Eliminar vehículo |

### Celdas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/celdas` | Listar todas las celdas |
| GET | `/api/celdas/:id` | Obtener celda por ID |
| POST | `/api/celdas` | Crear nueva celda |
| PUT | `/api/celdas/:id` | Actualizar celda |
| DELETE | `/api/celdas/:id` | Eliminar celda |

### Accesos y Salidas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/accesos-salidas` | Listar todos los registros |
| GET | `/api/accesos-salidas/:id` | Obtener registro por ID |
| POST | `/api/accesos-salidas` | Crear nuevo registro |
| PUT | `/api/accesos-salidas/:id` | Actualizar registro |
| DELETE | `/api/accesos-salidas/:id` | Eliminar registro |

### Historial de Parqueo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/historial-parqueo` | Listar todo el historial |
| GET | `/api/historial-parqueo/celda/:celdaId/vehiculo/:vehiculoId` | Obtener historial específico |
| POST | `/api/historial-parqueo` | Crear nuevo historial |
| DELETE | `/api/historial-parqueo/celda/:celdaId/vehiculo/:vehiculoId` | Eliminar historial |

### Incidencias

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/incidencias` | Listar todas las incidencias |
| GET | `/api/incidencias/:id` | Obtener incidencia por ID |
| POST | `/api/incidencias` | Crear nueva incidencia |
| PUT | `/api/incidencias/:id` | Actualizar incidencia |
| DELETE | `/api/incidencias/:id` | Eliminar incidencia |

### Perfiles de Usuario

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/perfil-usuarios` | Listar todos los perfiles |
| GET | `/api/perfil-usuarios/:id` | Obtener perfil por ID |
| POST | `/api/perfil-usuarios` | Crear nuevo perfil |
| PUT | `/api/perfil-usuarios/:id` | Actualizar perfil |
| DELETE | `/api/perfil-usuarios/:id` | Eliminar perfil |

### Pico y Placa

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pico-y-placa` | Listar todas las restricciones |
| GET | `/api/pico-y-placa/:id` | Obtener restricción por ID |
| POST | `/api/pico-y-placa` | Crear nueva restricción |
| PUT | `/api/pico-y-placa/:id` | Actualizar restricción |
| DELETE | `/api/pico-y-placa/:id` | Eliminar restricción |

### Reporte de Incidencias

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reporte-incidencias` | Listar todos los reportes |
| GET | `/api/reporte-incidencias/vehiculo/:vehiculoId/incidencia/:incidenciaId` | Obtener reporte específico |
| POST | `/api/reporte-incidencias` | Crear nuevo reporte |
| PUT | `/api/reporte-incidencias/vehiculo/:vehiculoId/incidencia/:incidenciaId` | Actualizar reporte |
| DELETE | `/api/reporte-incidencias/vehiculo/:vehiculoId/incidencia/:incidenciaId` | Eliminar reporte |

## Documentación Swagger

Accede a la documentación interactiva de la API en:

**Desarrollo local:** `http://localhost:3000/api-docs`

**Producción:** `https://backend-parking-project-v10.vercel.app/api-docs`

La documentación Swagger incluye:

- Descripción de cada endpoint
- Parámetros requeridos y opcionales
- Códigos de respuesta posibles
- Ejemplos de solicitud y respuesta

## Despliegue en Vercel

### Pasos para desplegar

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com) y regístrate

2. **Conectar repositorio**
   - Importa tu repositorio de GitHub en Vercel

3. **Configurar variables de entorno**
   - En el panel de Vercel, ve a "Environment Variables"
   - Añade `DATABASE_URL` con tu URL de Supabase

4. **Desplegar**
   - Vercel detectará automáticamente la configuración de `vercel.json`
   - El despliegue se realizará automáticamente en cada push

### Configuración de Vercel (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ]
}
```

## Formato de Respuestas

Todas las respuestas siguen un formato estándar:

**Éxito:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

**Error:**

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (opcional)"
}
```

## Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch
```

## Contribuciones

1. Fork del repositorio
2. Crear una rama (`git checkout -b feature/nueva-caracteristica`)
3. Realizar los cambios y commits (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear un Pull Request

## Licencia

MIT License - Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Autor

- **Adrian Restrepo** - [adrianrpo23@gmail.com](mailto:adrianrpo23@gmail.com)
- **GitHub:** [4DR14N-DEV](https://github.com/4DR14N-DEV)

## Soporte

¿Encontraste un bug o tienes sugerencias?

- Abre un issue en [GitHub Issues](https://github.com/4DR14N-DEV/backend-parking-project/issues)
