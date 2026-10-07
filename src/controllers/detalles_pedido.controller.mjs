import detallePedidoModel from '../models/detalles_pedido.model.mjs';

class DetallePedidoController {
    // Agregamos 'next'
    async crear(req, res, next) {
        try {
            const { id_pedido, id_producto, cantidad, subtotal } = req.body;

            if (!id_pedido || !id_producto || !cantidad || !subtotal) {
                return res.status(400).json({ error: "Faltan datos obligatorios (id_pedido, id_producto, cantidad, subtotal)." });
            }

            const resultado = await detallePedidoModel.crear(req.body);
            res.status(201).json({ mensaje: "Detalle agregado al pedido exitosamente", id_detalle: resultado.insertId });
        } catch (error) {
            // Si el producto o el pedido no existen en la BD, el middleware global lo ataja acá
            next(error);
        }
    }

    async obtenerPorPedido(req, res, next) {
        try {
            // En este caso, el ID del pedido viene por la URL (ej: /api/detalles/pedido/1)
            const { id_pedido } = req.params;
            const detalles = await detallePedidoModel.obtenerPorPedido(id_pedido);

            res.status(200).json(detalles);
        } catch (error) {
            next(error);
        }
    }

    async actualizarParcial(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await detallePedidoModel.actualizarParcial(id, req.body);

            if (!resultado) {
                return res.status(400).json({ error: "Debe enviar al menos un campo válido a modificar." });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Detalle no encontrado." });
            }

            res.status(200).json({ mensaje: "Detalle actualizado parcialmente" });
        } catch (error) {
            next(error);
        }
    }
}

export default new DetallePedidoController();