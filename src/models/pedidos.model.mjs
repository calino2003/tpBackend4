import pool from '../config/db.mjs';

class PedidoModel {
    // CREATE
    async crear(pedido) {
        // Si no mandan total, por defecto la base lo toma como 0.00, pero lo controlamos acá también
        const { total = 0.00, id_cliente, id_empleado, id_compania } = pedido;
        const query = 'INSERT INTO pedidos (total, id_cliente, id_empleado, id_compania) VALUES (?, ?, ?, ?)';
        const [resultado] = await pool.execute(query, [total, id_cliente, id_empleado, id_compania]);
        return resultado;
    }

    // READ (Acá aplicamos los JOINs)
    async obtenerTodos() {
        const query = `
            SELECT
                p.id_pedido,
                p.fecha,
                p.total,
                c.nombre AS cliente_nombre,
                c.apellido AS cliente_apellido,
                e.nombre AS empleado_nombre,
                e.apellido AS empleado_apellido,
                env.nombre AS compania_nombre
            FROM pedidos p
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
            LEFT JOIN empleados e ON p.id_empleado = e.id_empleado
            LEFT JOIN companias_envio env ON p.id_compania = env.id_compania
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    // READ by ID
    async obtenerPorId(id) {
        const query = `
            SELECT p.*, c.nombre AS cliente, e.nombre AS empleado, env.nombre AS compania
            FROM pedidos p
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
            LEFT JOIN empleados e ON p.id_empleado = e.id_empleado
            LEFT JOIN companias_envio env ON p.id_compania = env.id_compania
            WHERE p.id_pedido = ?
        `;
        const [filas] = await pool.query(query, [id]);
        return filas[0];
    }

    // UPDATE (Actualizar estado o total)
    async actualizar(id, pedido) {
        const { total, id_cliente, id_empleado, id_compania } = pedido;
        const query = 'UPDATE pedidos SET total = ?, id_cliente = ?, id_empleado = ?, id_compania = ? WHERE id_pedido = ?';
        const [resultado] = await pool.execute(query, [total, id_cliente, id_empleado, id_compania, id]);
        return resultado;
    }

    // UPDATE PARCIAL (PATCH): actualiza solo los campos enviados
    async actualizarParcial(id, pedido) {
        const permitidas = ['total', 'id_cliente', 'id_empleado', 'id_compania'];
        const campos = Object.entries(pedido).filter(([campo]) => permitidas.includes(campo));

        if (campos.length === 0) return null;

        const sets = campos.map(([campo]) => `${campo} = ?`).join(', ');
        const valores = campos.map(([, valor]) => valor);

        const query = `UPDATE pedidos SET ${sets} WHERE id_pedido = ?`;
        const [resultado] = await pool.execute(query, [...valores, id]);
        return resultado;
    }

    // DELETE
    async eliminar(id) {
        const query = 'DELETE FROM pedidos WHERE id_pedido = ?';
        const [resultado] = await pool.execute(query, [id]);
        return resultado;
    }
}

export default new PedidoModel();
