import pool from '../config/db.mjs';

class ProveedorModel {
    // POST: Crear proveedor en la BD
    async crear(proveedor) {
        const { razon_social, cuit, telefono, email } = proveedor;

        // Cumplimos con la seguridad exigida usando consultas parametrizadas (?) para evitar Inyección SQL
        const query = 'INSERT INTO PROVEEDORES (razon_social, cuit, telefono, email) VALUES (?, ?, ?, ?)';

        // Usamos execute en lugar de query cuando pasamos parámetros dinámicos
        const [resultado] = await pool.execute(query, [razon_social, cuit, telefono, email]);
        return resultado;
    }

    // GET: Obtener todos los proveedores (acepta filtrados: /api/proveedores?razon_social=...)
    async obtenerTodos(filtros = {}) {
        const mapaFiltros = {
            razon_social: { columna: 'razon_social', like: true },
            cuit:         { columna: 'cuit' },
            email:        { columna: 'email', like: true }
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

        let query = 'SELECT * FROM PROVEEDORES';
        if (condiciones.length > 0) query += ` WHERE ${condiciones.join(' AND ')}`;

        const [filas] = await pool.query(query, valores);
        return filas;
    }

    // AGGREGATION (COUNT + GROUP BY): cuántos productos tiene cada proveedor
    async obtenerEstadisticas() {
        const query = `
            SELECT pr.id_proveedor, pr.razon_social,
                   COUNT(p.id_producto) AS productos,
                   IFNULL(SUM(p.stock), 0) AS stock_total
            FROM PROVEEDORES pr
            LEFT JOIN productos p ON pr.id_proveedor = p.id_proveedor
            GROUP BY pr.id_proveedor, pr.razon_social
            ORDER BY productos DESC
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    // GET: Obtener un proveedor por su ID
    async obtenerPorId(id) {
        const [filas] = await pool.execute('SELECT * FROM PROVEEDORES WHERE id_proveedor = ?', [id]);
        return filas[0];
    }

    // PUT: Actualizar un proveedor existente
    async actualizar(id, proveedor) {
        const { razon_social, cuit, telefono, email } = proveedor;

        const query = 'UPDATE PROVEEDORES SET razon_social = ?, cuit = ?, telefono = ?, email = ? WHERE id_proveedor = ?';
        const [resultado] = await pool.execute(query, [razon_social, cuit, telefono, email, id]);

        return resultado;
    }

    // UPDATE PARCIAL (PATCH): actualiza solo los campos enviados
    async actualizarParcial(id, proveedor) {
        const permitidas = ['razon_social', 'cuit', 'telefono', 'email'];
        const campos = Object.entries(proveedor).filter(([campo]) => permitidas.includes(campo));

        if (campos.length === 0) return null;

        const sets = campos.map(([campo]) => `${campo} = ?`).join(', ');
        const valores = campos.map(([, valor]) => valor);

        const query = `UPDATE PROVEEDORES SET ${sets} WHERE id_proveedor = ?`;
        const [resultado] = await pool.execute(query, [...valores, id]);

        return resultado;
    }

    // DELETE: Eliminar un proveedor
    async eliminar(id) {
        const query = 'DELETE FROM PROVEEDORES WHERE id_proveedor = ?';
        const [resultado] = await pool.execute(query, [id]);

        return resultado;
    }
}

export default new ProveedorModel();
