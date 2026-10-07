import pedidoModel from '../models/pedidos.model.mjs';

class PedidoController {
    // 1. Agregamos el parámetro next
    async crear(req, res, next) {
        try {
            const { id_cliente } = req.body;

            // Regla de negocio: No hay pedido fantasma, necesitamos un cliente
            if (!id_cliente) {
                return res.status(400).json({ error: "El id_cliente es obligatorio para generar un pedido." });
            }

            const resultado = await pedidoModel.crear(req.body);
            res.status(201).json({ mensaje: "Pedido creado exitosamente", id_pedido: resultado.insertId });
        } catch (error) {
            // 2. Delegamos el error al middleware global
            next(error);
        }
    }

    async obtenerTodos(req, res, next) {
        try {
            const pedidos = await pedidoModel.obtenerTodos();
            res.status(200).json(pedidos);
        } catch (error) {
            next(error);
        }
    }

    async obtenerPorId(req, res, next) {
        try {
            const { id } = req.params;
            const pedido = await pedidoModel.obtenerPorId(id);

            if (!pedido) {
                return res.status(404).json({ error: "Pedido no encontrado." });
            }

            res.status(200).json(pedido);
        } catch (error) {
            next(error);
        }
    }

    async actualizar(req, res, next) {
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
            next(error);
        }
    }

    async eliminar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await pedidoModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Pedido no encontrado para eliminar." });
            }

            res.status(200).json({ mensaje: "Pedido eliminado exitosamente" });
        } catch (error) {
            // Toda la validación manual de ER_ROW_IS_REFERENCED_2 que hizo tu compañero
            // ahora es procesada automáticamente por el errorHandler.mjs
            next(error);
        }
    }

    async actualizarParcial(req, res, next) {
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
            next(error);
        }
    }
}

export default new PedidoController();