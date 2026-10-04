import { Router } from 'express';
import { crearCliente, obtenerClientes, obtenerClientePorId, actualizarCliente, eliminarCliente } from '../controllers/clientes.controller.mjs';

const router = Router();

router.post('/', crearCliente);
router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;