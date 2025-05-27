import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/login', authController.login);

// Rutas protegidas
router.use(authMiddleware);
router.get('/profile', authController.getProfile);
router.post('/change-password', authController.changePassword);

export default router; 