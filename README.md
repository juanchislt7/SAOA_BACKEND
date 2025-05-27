# Sistema de Gestión de Turnos SAOA - Backend

Sistema de gestión de turnos y asistencias desarrollado con Node.js, Express y MySQL.

## Requisitos Mínimos del Sistema

- Node.js (versión 18.x o superior)
- MySQL (versión 8.0 o superior)
- npm (incluido con Node.js)
- Git

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/juanchislt7/SAOA_BACKEND.git
   cd SAOA_BACKEND
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crear un archivo `.env` en la raíz del proyecto
   - Copiar el contenido del archivo `.env.example` (si existe)
   - Configurar las siguientes variables:
     ```env
     DB_HOST=localhost
     DB_PORT=3306
     DB_NAME=turnos_db
     DB_USER=root
     DB_PASSWORD=tu_contraseña
     PORT=3000
     NODE_ENV=development
     JWT_SECRET=tu_clave_secreta_muy_segura
     JWT_EXPIRES_IN=24h
     ```

4. **Crear la base de datos**
   ```sql
   CREATE DATABASE turnos_db;
   ```

5. **Ejecutar migraciones** (si existen)
   ```bash
   npm run migrate
   ```

6. **Iniciar el servidor**
   ```bash
   # Desarrollo
   npm run dev

   # Producción
   npm start
   ```

## Estructura del Proyecto

```
src/
├── config/         # Configuraciones (base de datos, etc.)
├── controllers/    # Controladores de la aplicación
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos de la base de datos
├── routes/         # Rutas de la API
├── tests/          # Pruebas unitarias
└── app.js          # Punto de entrada de la aplicación
```

## Scripts Disponibles

- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon
- `npm test`: Ejecuta las pruebas unitarias

## API Endpoints

### Autenticación
- `POST /autenticacion/login`: Iniciar sesión
- `GET /autenticacion/perfil`: Obtener perfil del usuario
- `POST /autenticacion/cambiar-password`: Cambiar contraseña

### Usuarios
- `GET /usuarios`: Listar usuarios (admin)
- `POST /usuarios`: Crear usuario (admin)
- `PUT /usuarios/:id`: Actualizar usuario (admin)
- `DELETE /usuarios/:id`: Desactivar usuario (admin)

### Clientes
- `GET /clientes`: Listar clientes
- `POST /clientes`: Crear cliente
- `PUT /clientes/:documento`: Actualizar cliente
- `DELETE /clientes/:documento`: Desactivar cliente

### Asistencias
- `GET /asistencias`: Listar asistencias
- `POST /asistencias`: Registrar asistencia
- `PUT /asistencias/:id`: Actualizar asistencia
- `DELETE /asistencias/:id`: Eliminar asistencia

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Soporte

Para soporte, por favor abrir un issue en el repositorio de GitHub. 

## Autor

Juan Guillermo Hoyos.
juanguillermolt@gmail.com