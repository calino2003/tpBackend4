import { Router } from 'express';
import pedidoController from '../controllers/pedidos.controller.mjs';

const router = Router();

router.post('/', pedidoController.crear);
router.get('/', pedidoController.obtenerTodos);
router.get('/estadisticas', pedidoController.estadisticas);
router.get('/totales-por-cliente', pedidoController.totalesPorCliente);
router.get('/:id', pedidoController.obtenerPorId);
router.put('/:id', pedidoController.actualizar);
router.patch('/:id', pedidoController.actualizarParcial);
router.delete('/:id', pedidoController.eliminar);

export default router;
