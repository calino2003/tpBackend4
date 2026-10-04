import { 
    crearPedidoDb, 
    obtenerPedidosDb, 
    obtenerPedidoPorIdDb,
    actualizarPedidoDb, 
    eliminarPedidoDb 
} from '../models/pedidos.model.mjs';

export const crearPedido = async (req, res) => {
    try {
        const { id_cliente } = req.body;
        
        // Regla de negocio: No hay pedido fantasma, necesitamos un cliente
        if (!id_cliente) {
            return res.status(400).json({ error: "El id_cliente es obligatorio para generar un pedido." });
        }

        const resultado = await crearPedidoDb(req.body);
        res.status(201).json({ mensaje: "Pedido creado exitosamente", id_pedido: resultado.insertId });
    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await obtenerPedidosDb();
        res.status(200).json(pedidos);
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({ error: "Error al consultar la base de datos." });
    }
};

export const obtenerPedidoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await obtenerPedidoPorIdDb(id);
        
        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado." });
        }
        
        res.status(200).json(pedido);
    } catch (error) {
        console.error("Error al obtener el pedido:", error);
        res.status(500).json({ error: "Error al consultar la base de datos." });
    }
};

export const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_cliente } = req.body;
        
        // Mantenemos la regla de negocio: un pedido no puede quedar huérfano de cliente
        if (!id_cliente) {
            return res.status(400).json({ error: "El id_cliente es obligatorio para actualizar el pedido." });
        }

        const resultado = await actualizarPedidoDb(id, req.body);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Pedido no encontrado para actualizar." });
        }
        
        res.status(200).json({ mensaje: "Pedido actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar pedido:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await eliminarPedidoDb(id);
        
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
};