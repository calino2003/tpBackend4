import { Router } from 'express';
import { crearProveedor, obtenerProveedores, actualizarProveedor, eliminarProveedor } from '../controllers/proveedores.controller.mjs';

const router = Router();

router.post('/', crearProveedor);
router.get('/', obtenerProveedores);

// Agregamos las dos rutas nuevas con parámetro ID
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);

export default router;