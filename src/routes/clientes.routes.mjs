import { Router } from 'express';
import clienteController from '../controllers/clientes.controller.mjs';

const router = Router();

router.post('/', clienteController.crear);
router.get('/', clienteController.obtenerTodos);
router.get('/:id', clienteController.obtenerPorId);
router.put('/:id', clienteController.actualizar);
router.delete('/:id', clienteController.eliminar);

export default router;
