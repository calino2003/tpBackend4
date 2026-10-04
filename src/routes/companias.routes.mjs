import { Router } from 'express';
import companiaController from '../controllers/companias.controller.mjs';

const router = Router();

router.post('/', companiaController.crear);
router.get('/', companiaController.obtenerTodos);
router.get('/:id', companiaController.obtenerPorId);
router.put('/:id', companiaController.actualizar);
router.delete('/:id', companiaController.eliminar);

export default router;
