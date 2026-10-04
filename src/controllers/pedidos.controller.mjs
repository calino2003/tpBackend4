import pedidoModel from '../models/pedidos.model.mjs';

class PedidoController {
    async crear(req, res) {
        try {
            const { id_cliente } = req.body;

            // Regla de negocio: No hay pedido fantasma, necesitamos un cliente
            if (!id_cliente) {
                return res.status(400).json({ error: "El id_cliente es obligatorio para generar un pedido." });
            }

            const resultado = await pedidoModel.crear(req.body);
            res.status(201).json({ mensaje: "Pedido creado exitosamente", id_pedido: resultado.insertId });
        } catch (error) {
            console.error("Error al crear pedido:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const pedidos = await pedidoModel.obtenerTodos();
            res.status(200).json(pedidos);
        } catch (error) {
            console.error("Error al obtener pedidos:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const pedido = await pedidoModel.obtenerPorId(id);

            if (!pedido) {
                return res.status(404).json({ error: "Pedido no encontrado." });
            }

            res.status(200).json(pedido);
        } catch (error) {
            console.error("Error al obtener el pedido:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { id_cliente } = req.body;

            // Mantenemos la regla de negocio: un pedido no puede quedar huérfano de cliente
            if (!id_cliente) {
                return res.status(400).json({ error: "El id_cliente es obligatorio para actualizar el pedido." });
            }

            const resultado = await pedidoModel.actualizar(id, req.body);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Pedido no encontrado para actualizar." });
            }

            res.status(200).json({ mensaje: "Pedido actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar pedido:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await pedidoModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Pedido no encontrado para eliminar." });
            }

            res.status(200).json({ mensaje: "Pedido eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar pedido:", error);

            // Lógica de negocio (manejo de clave foránea)
            // Si el error es ER_ROW_IS_REFERENCED_2, significa que el pedido ya tiene detalles asociados
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({ error: "No se puede eliminar el pedido porque tiene productos asociados en sus detalles." });
            }

            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async actualizarParcial(req, res) {
        try {
            const { id } = req.params;
            const resultado = await pedidoModel.actualizarParcial(id, req.body);

            if (!resultado) {
                return res.status(400).json({ error: "Debe enviar al menos un campo válido a modificar." });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Pedido no encontrado." });
            }

            res.status(200).json({ mensaje: "Pedido actualizado parcialmente" });
        } catch (error) {
            console.error("Error al actualizar pedido (parcial):", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}

export default new PedidoController();
