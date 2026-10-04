import { Router } from 'express';
import { crearDetalle, obtenerDetallesPorPedido } from '../controllers/detalles_pedido.controller.mjs';

const router = Router();

router.post('/', crearDetalle);
router.get('/pedido/:id_pedido', obtenerDetallesPorPedido); 

export default router;