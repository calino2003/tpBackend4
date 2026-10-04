import { Router } from 'express';
import empleadoController from '../controllers/empleados.controller.mjs';

const router = Router();

router.post('/', empleadoController.crear);
router.get('/', empleadoController.obtenerTodos);
router.get('/:id', empleadoController.obtenerPorId);
router.put('/:id', empleadoController.actualizar);
router.delete('/:id', empleadoController.eliminar);

export default router;
