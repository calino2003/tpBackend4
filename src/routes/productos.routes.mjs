import { Router } from 'express';
import { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto } from '../controllers/productos.controller.mjs';

const router = Router();

router.post('/', crearProducto);
router.get('/', obtenerProductos);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

export default router;