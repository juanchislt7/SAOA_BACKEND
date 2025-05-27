import express from 'express';
import usuarioController from '../controllers/usuarioController.js';
import authMiddleware from '../middlewares/auth.js';
import roleMiddleware from '../middlewares/role.js';

const router = express.Router();

// Rutas públicas
router.post('/login', usuarioController.login);
router.post('/registro', usuarioController.registro);

// Rutas protegidas
router.use(authMiddleware);

// Rutas que requieren autenticación
router.get('/perfil', usuarioController.getProfile);
router.put('/perfil', usuarioController.updateProfile);
router.post('/cambiar-password', usuarioController.changePassword);

// Rutas que requieren rol de administrador
router.get('/', roleMiddleware(['admin']), usuarioController.list);
router.get('/:id', roleMiddleware(['admin']), usuarioController.getById);
router.post('/', roleMiddleware(['admin']), usuarioController.create);
router.put('/:id', roleMiddleware(['admin']), usuarioController.update);
router.delete('/:id', roleMiddleware(['admin']), usuarioController.delete);

export default router;