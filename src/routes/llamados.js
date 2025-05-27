import express from 'express';
import llamadoController from '../controllers/llamadoController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de llamados
router.get('/', llamadoController.list);
router.get('/:id', llamadoController.getById);
router.post('/', llamadoController.create);
router.put('/:id', llamadoController.update);
router.delete('/:id', llamadoController.delete);

// Rutas adicionales
router.get('/cita/:cita_id', llamadoController.getByCita);
router.get('/fecha/:fecha', llamadoController.getByFecha);

export default router;