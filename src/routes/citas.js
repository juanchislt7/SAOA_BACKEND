import express from 'express';
import citaController from '../controllers/citaController.js';
import roleMiddleware from '../middlewares/role.js';

const router = express.Router();

router.get('/', citaController.list);
router.get('/:id', citaController.getById);
router.post('/', roleMiddleware(['admin', 'operador']), citaController.create);
router.put('/:id', roleMiddleware(['admin', 'operador']), citaController.update);
router.delete('/:id', roleMiddleware(['admin']), citaController.delete);

export default router;