import pool from '../config/db.mjs';

class CompaniaModel {
    // CREATE
    async crear(compania) {
        const { nombre, telefono } = compania;
        const query = 'INSERT INTO companias_envio (nombre, telefono) VALUES (?, ?)';
        const [resultado] = await pool.execute(query, [nombre, telefono]);
        return resultado;
    }

    // READ (acepta filtrados opcionales: /api/companias?nombre=...)
    async obtenerTodos(filtros = {}) {
        const mapaFiltros = {
            nombre:  { columna: 'nombre', like: true },
            telefono: { columna: 'telefono' }
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

        let query = 'SELECT * FROM companias_envio';
        if (condiciones.length > 0) query += ` WHERE ${condiciones.join(' AND ')}`;

        const [filas] = await pool.query(query, valores);
        return filas;
    }

    // AGGREGATION (COUNT + GROUP BY): pedidos que envió cada compañía
    async obtenerEstadisticas() {
        const query = `
            SELECT c.id_compania, c.nombre, COUNT(p.id_pedido) AS pedidos
            FROM companias_envio c
            LEFT JOIN pedidos p ON c.id_compania = p.id_compania
            GROUP BY c.id_compania, c.nombre
            ORDER BY pedidos DESC
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    // READ by ID
    async obtenerPorId(id) {
        const query = 'SELECT * FROM companias_envio WHERE id_compania = ?';
        const [filas] = await pool.execute(query, [id]);
        return filas[0];
    }

    // UPDATE
    async actualizar(id, compania) {
        const { nombre, telefono } = compania;
        const query = 'UPDATE companias_envio SET nombre = ?, telefono = ? WHERE id_compania = ?';
        const [resultado] = await pool.execute(query, [nombre, telefono, id]);
        return resultado;
    }

    // UPDATE PARCIAL (PATCH): actualiza solo los campos enviados
    async actualizarParcial(id, compania) {
        const permitidas = ['nombre', 'telefono'];
        const campos = Object.entries(compania).filter(([campo]) => permitidas.includes(campo));

        if (campos.length === 0) return null;

        const sets = campos.map(([campo]) => `${campo} = ?`).join(', ');
        const valores = campos.map(([, valor]) => valor);

        const query = `UPDATE companias_envio SET ${sets} WHERE id_compania = ?`;
        const [resultado] = await pool.execute(query, [...valores, id]);
        return resultado;
    }

    // DELETE
    async eliminar(id) {
        const query = 'DELETE FROM companias_envio WHERE id_compania = ?';
        const [resultado] = await pool.execute(query, [id]);
        return resultado;
    }
}

export default new CompaniaModel();
