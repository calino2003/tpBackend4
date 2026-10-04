import { Router } from 'express';
import productoController from '../controllers/productos.controller.mjs';

const router = Router();

router.post('/', productoController.crear);
router.get('/', productoController.obtenerTodos);
router.get('/:id', productoController.obtenerPorId);
router.put('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

export default router;
