import pool from '../config/db.mjs';

class DetallePedidoModel {
    // CREATE: Insertar una línea de producto en el pedido
    async crear(detalle) {
        const { id_pedido, id_producto, cantidad, subtotal } = detalle;
        const query = 'INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)';
        const [resultado] = await pool.execute(query, [id_pedido, id_producto, cantidad, subtotal]);
        return resultado;
    }

    // READ: Obtener todos los detalles de un pedido específico cruzando con productos
    async obtenerPorPedido(id_pedido) {
        const query = `
            SELECT
                dp.id_detalle,
                dp.cantidad,
                dp.subtotal,
                p.id_producto,
                p.nombre AS producto_nombre,
                p.precio_unitario AS producto_precio
            FROM detalles_pedido dp
            LEFT JOIN productos p ON dp.id_producto = p.id_producto
            WHERE dp.id_pedido = ?
        `;
        const [filas] = await pool.query(query, [id_pedido]);
        return filas;
    }

    // UPDATE PARCIAL (PATCH): actualiza solo los campos enviados de una línea de detalle
    async actualizarParcial(id, detalle) {
        const permitidas = ['id_pedido', 'id_producto', 'cantidad', 'subtotal'];
        const campos = Object.entries(detalle).filter(([campo]) => permitidas.includes(campo));

        if (campos.length === 0) return null;

        const sets = campos.map(([campo]) => `${campo} = ?`).join(', ');
        const valores = campos.map(([, valor]) => valor);

        const query = `UPDATE detalles_pedido SET ${sets} WHERE id_detalle = ?`;
        const [resultado] = await pool.execute(query, [...valores, id]);
        return resultado;
    }
}

export default new DetallePedidoModel();
