import { Router } from 'express';
import { crearProveedor, obtenerProveedores, obtenerProveedorPorId, actualizarProveedor, eliminarProveedor } from '../controllers/proveedores.controller.mjs';

const router = Router();

router.post('/', crearProveedor);
router.get('/', obtenerProveedores);
router.get('/:id', obtenerProveedorPorId);

// Agregamos las dos rutas nuevas con parámetro ID
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);

export default router;