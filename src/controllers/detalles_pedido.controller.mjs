import detallePedidoModel from '../models/detalles_pedido.model.mjs';

class DetallePedidoController {
    async crear(req, res) {
        try {
            const { id_pedido, id_producto, cantidad, subtotal } = req.body;

            if (!id_pedido || !id_producto || !cantidad || !subtotal) {
                return res.status(400).json({ error: "Faltan datos obligatorios (id_pedido, id_producto, cantidad, subtotal)." });
            }

            const resultado = await detallePedidoModel.crear(req.body);
            res.status(201).json({ mensaje: "Detalle agregado al pedido exitosamente", id_detalle: resultado.insertId });
        } catch (error) {
            console.error("Error al crear detalle:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async obtenerPorPedido(req, res) {
        try {
            // En este caso, el ID del pedido viene por la URL (ej: /api/detalles/pedido/1)
            const { id_pedido } = req.params;
            const detalles = await detallePedidoModel.obtenerPorPedido(id_pedido, req.query);

            res.status(200).json(detalles);
        } catch (error) {
            console.error("Error al obtener detalles:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async actualizarParcial(req, res) {
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
            console.error("Error al actualizar detalle (parcial):", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    // AGGREGATION: /api/detalles/mas-vendidos (SUM + JOIN + GROUP BY)
    async productosMasVendidos(req, res) {
        try {
            const productos = await detallePedidoModel.obtenerProductosMasVendidos();
            res.status(200).json(productos);
        } catch (error) {
            console.error("Error al obtener productos más vendidos:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }
}

export default new DetallePedidoController();
