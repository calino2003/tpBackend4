import { Router } from 'express';
import proveedorController from '../controllers/proveedores.controller.mjs';

const router = Router();

router.post('/', proveedorController.crear);
router.get('/', proveedorController.obtenerTodos);
router.get('/:id', proveedorController.obtenerPorId);

// Agregamos las dos rutas nuevas con parámetro ID
router.put('/:id', proveedorController.actualizar);
router.patch('/:id', proveedorController.actualizarParcial);
router.delete('/:id', proveedorController.eliminar);

export default router;
