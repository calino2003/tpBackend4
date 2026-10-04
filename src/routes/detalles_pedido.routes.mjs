import { Router } from 'express';
import detallePedidoController from '../controllers/detalles_pedido.controller.mjs';

const router = Router();

router.post('/', detallePedidoController.crear);
router.get('/pedido/:id_pedido', detallePedidoController.obtenerPorPedido);
router.patch('/:id', detallePedidoController.actualizarParcial);

export default router;
