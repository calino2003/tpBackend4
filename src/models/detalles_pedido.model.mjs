import pool from '../config/db.mjs';

class DetallePedidoModel {
    // CREATE: Insertar una línea de producto en el pedido
    async crear(detalle) {
        const { id_pedido, id_producto, cantidad, subtotal } = detalle;
        const query = 'INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)';
        const [resultado] = await pool.execute(query, [id_pedido, id_producto, cantidad, subtotal]);
        return resultado;
    }

    // READ: Detalles de un pedido específico (filtro opcional: /api/detalles/pedido/1?producto=1)
    async obtenerPorPedido(id_pedido, filtros = {}) {
        const condiciones = ['dp.id_pedido = ?'];
        const valores = [id_pedido];

        if (filtros.producto !== undefined && filtros.producto !== '') {
            condiciones.push('dp.id_producto = ?');
            valores.push(filtros.producto);
        }

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
            WHERE ${condiciones.join(' AND ')}
        `;
        const [filas] = await pool.query(query, valores);
        return filas;
    }

    // AGGREGATION (SUM + JOIN + GROUP BY): productos más vendidos
    async obtenerProductosMasVendidos() {
        const query = `
            SELECT p.id_producto, p.nombre,
                   SUM(d.cantidad) AS unidades_vendidas,
                   SUM(d.subtotal) AS facturado
            FROM detalles_pedido d
            INNER JOIN productos p ON d.id_producto = p.id_producto
            GROUP BY p.id_producto, p.nombre
            ORDER BY unidades_vendidas DESC
        `;
        const [filas] = await pool.query(query);
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
