import express from 'express';
import clienteController from '../controllers/clienteController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de clientes
router.get('/', clienteController.list);
router.get('/search', clienteController.search);
router.get('/:id', clienteController.getById);
router.post('/', clienteController.create);
router.put('/:id', clienteController.update);
router.delete('/:id', clienteController.delete);

export default router;