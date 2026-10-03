import { Router } from 'express';
import { crearEmpleado, obtenerEmpleados, actualizarEmpleado, eliminarEmpleado } from '../controllers/empleados.controller.mjs';

const router = Router();

router.post('/', crearEmpleado);
router.get('/', obtenerEmpleados);
router.put('/:id', actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);

export default router;