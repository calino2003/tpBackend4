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

    // READ (Acá aplicamos los JOINs + filtrados opcionales)
    async obtenerTodos(filtros = {}) {
        // Whitelist: los filtros apuntan a los alias de las tablas del JOIN
        const mapaFiltros = {
            cliente:  { columna: 'c.nombre', like: true },
            empleado: { columna: 'e.nombre', like: true },
            desde:    { columna: 'p.fecha', operador: '>=' },   // /api/pedidos?desde=2026-01-01
            hasta:    { columna: 'p.fecha', operador: '<'  }    // /api/pedidos?hasta=2026-12-31
        };

        const condiciones = [];
        const valores = [];

        for (const [parametro, regla] of Object.entries(mapaFiltros)) {
            const valor = filtros[parametro];
            if (valor === undefined || valor === '') continue;

            if (regla.like) {
                condiciones.push(`${regla.columna} LIKE ?`);
                valores.push(`%${valor}%`);
            } else {
                const operador = regla.operador || '=';
                condiciones.push(`${regla.columna} ${operador} ?`);
                valores.push(valor);
            }
        }

        let query = `
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

        if (condiciones.length > 0) query += ` WHERE ${condiciones.join(' AND ')}`;

        const [filas] = await pool.query(query, valores);
        return filas;
    }

    // AGGREGATION: COUNT, SUM, AVG, MAX y MIN sobre los pedidos
    async obtenerEstadisticas() {
        const query = `
            SELECT COUNT(*) AS cantidad,
                   SUM(total) AS total,
                   AVG(total) AS promedio,
                   MAX(total) AS maximo,
                   MIN(total) AS minimo
            FROM pedidos
        `;
        const [filas] = await pool.query(query);
        return filas[0];
    }

    // AGGREGATION (SUM + COUNT + JOIN + GROUP BY): cuánto gastó cada cliente
    async obtenerTotalesPorCliente() {
        const query = `
            SELECT c.id_cliente, c.nombre, c.apellido,
                   COUNT(p.id_pedido) AS pedidos,
                   IFNULL(SUM(p.total), 0) AS total_gastado
            FROM clientes c
            LEFT JOIN pedidos p ON c.id_cliente = p.id_cliente
            GROUP BY c.id_cliente, c.nombre, c.apellido
            ORDER BY total_gastado DESC
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
