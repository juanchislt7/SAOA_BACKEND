import express from 'express';
import asistenciaController from '../controllers/asistenciaController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de asistencias
router.get('/', asistenciaController.list);
router.get('/:id', asistenciaController.getById);
router.post('/', asistenciaController.create);
router.put('/:id', asistenciaController.update);
router.delete('/:id', asistenciaController.delete);

// Rutas adicionales
router.get('/cliente/:clienteId', asistenciaController.getByCliente);
router.get('/fecha/:fecha', asistenciaController.getByFecha);

export default router;