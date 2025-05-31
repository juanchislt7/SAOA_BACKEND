import express from 'express';
import citaController from '../controllers/citaController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de citas
router.get('/', citaController.list);
router.get('/:id', citaController.getById);
router.post('/', citaController.create);
router.put('/:id', citaController.update);
router.delete('/:id', citaController.delete);

// Ruta para obtener citas por fecha
router.get('/fecha/:fecha', citaController.getByFecha);

// Rutas adicionales
router.get('/identificacion/:identificacion', citaController.getByIdentificacion);

export default router;