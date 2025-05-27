import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authMiddleware from './middlewares/auth.js';
import './models/index.js';
import authRoutes from './routes/auth.js';
import clientesRoutes from './routes/clientes.js';
import citasRoutes from './routes/citas.js';
import asistenciasRoutes from './routes/asistencias.js';
import llamadosRoutes from './routes/llamados.js';
import usuariosRoutes from './routes/usuarios.js';

const app = express();

// Configuración básica
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
// Rutas públicas
app.use('/autenticacion', authRoutes);

// Rutas protegidas
app.use(authMiddleware);
app.use('/clientes', clientesRoutes);
app.use('/citas', citasRoutes);
app.use('/asistencias', asistenciasRoutes);
app.use('/llamados', llamadosRoutes);
app.use('/usuarios', usuariosRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});