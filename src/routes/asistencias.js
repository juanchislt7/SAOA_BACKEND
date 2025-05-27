import express from 'express';
import asistenciaController from '../controllers/asistenciaController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de asistencias
router.get('/', asistenciaController.list);
router.get('/:id', asistenciaController.getById);
router.post('/', asistenciaController.create);
router.put('/:id', asistenciaController.update);
router.delete('/:id', asistenciaController.delete);

// Rutas adicionales
router.get('/cliente/:documento', asistenciaController.getByCliente);
router.get('/fecha/:fecha', asistenciaController.getByFecha);

export default router;