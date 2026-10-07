import pool from '../config/db.mjs';

class EmpleadoModel {
    // CREATE
    async crear(empleado) {
        const { nombre, apellido, cargo } = empleado;
        const query = 'INSERT INTO empleados (nombre, apellido, cargo) VALUES (?, ?, ?)';
        const [resultado] = await pool.execute(query, [nombre, apellido, cargo]);
        return resultado;
    }

    // READ (acepta filtrados opcionales: /api/empleados?nombre=...&cargo=...)
    async obtenerTodos(filtros = {}) {
        const mapaFiltros = {
            nombre:   { columna: 'nombre', like: true },
            apellido: { columna: 'apellido', like: true },
            cargo:    { columna: 'cargo', like: true }
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

        let query = 'SELECT * FROM empleados';
        if (condiciones.length > 0) query += ` WHERE ${condiciones.join(' AND ')}`;

        const [filas] = await pool.query(query, valores);
        return filas;
    }

    // AGGREGATION (SUM + COUNT + GROUP BY): pedidos atendidos y vendido por empleado
    async obtenerEstadisticas() {
        const query = `
            SELECT e.id_empleado, e.nombre, e.apellido,
                   COUNT(p.id_pedido) AS pedidos,
                   IFNULL(SUM(p.total), 0) AS total_vendido
            FROM empleados e
            LEFT JOIN pedidos p ON e.id_empleado = p.id_empleado
            GROUP BY e.id_empleado, e.nombre, e.apellido
            ORDER BY total_vendido DESC
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    // READ by ID
    async obtenerPorId(id) {
        const query = 'SELECT * FROM empleados WHERE id_empleado = ?';
        const [filas] = await pool.execute(query, [id]);
        return filas[0];
    }

    // UPDATE
    async actualizar(id, empleado) {
        const { nombre, apellido, cargo } = empleado;
        const query = 'UPDATE empleados SET nombre = ?, apellido = ?, cargo = ? WHERE id_empleado = ?';
        const [resultado] = await pool.execute(query, [nombre, apellido, cargo, id]);
        return resultado;
    }

    // UPDATE PARCIAL (PATCH): actualiza solo los campos enviados
    async actualizarParcial(id, empleado) {
        const permitidas = ['nombre', 'apellido', 'cargo'];
        const campos = Object.entries(empleado).filter(([campo]) => permitidas.includes(campo));

        if (campos.length === 0) return null;

        const sets = campos.map(([campo]) => `${campo} = ?`).join(', ');
        const valores = campos.map(([, valor]) => valor);

        const query = `UPDATE empleados SET ${sets} WHERE id_empleado = ?`;
        const [resultado] = await pool.execute(query, [...valores, id]);
        return resultado;
    }

    // DELETE
    async eliminar(id) {
        const query = 'DELETE FROM empleados WHERE id_empleado = ?';
        const [resultado] = await pool.execute(query, [id]);
        return resultado;
    }
}

export default new EmpleadoModel();
