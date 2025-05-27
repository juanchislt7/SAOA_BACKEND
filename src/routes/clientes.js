import express from 'express';
import clienteController from '../controllers/clienteController.js';
import roleMiddleware from '../middlewares/role.js';

const router = express.Router();

router.get('/', clienteController.list);
router.get('/:documento', clienteController.getById);
router.post('/', roleMiddleware(['admin']), clienteController.create);
router.put('/:documento', roleMiddleware(['admin']), clienteController.update);
router.delete('/:documento', roleMiddleware(['admin']), clienteController.delete);

export default router;