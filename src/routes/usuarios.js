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
router.get('/', roleMiddleware(['registrador', 'coordinador_enlace']), usuarioController.list);
router.get('/:id', roleMiddleware(['registrador', 'coordinador_enlace']), usuarioController.getById);
router.post('/', roleMiddleware(['registrador', 'coordinador_enlace']), usuarioController.create);
router.put('/:id', roleMiddleware(['registrador', 'coordinador_enlace']), usuarioController.update);
router.delete('/:id', roleMiddleware(['registrador']), usuarioController.delete);

export default router;