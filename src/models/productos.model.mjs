import pool from '../config/db.mjs';

class ProductoModel {
    // CREATE
    async crear(producto) {
        const { nombre, descripcion, precio_unitario, stock, id_proveedor } = producto;
        const query = 'INSERT INTO productos (nombre, descripcion, precio_unitario, stock, id_proveedor) VALUES (?, ?, ?, ?, ?)';
        const [resultado] = await pool.execute(query, [nombre, descripcion, precio_unitario, stock, id_proveedor]);
        return resultado;
    }

    // READ (acepta filtrados opcionales: /api/productos?nombre=...&stock_min=10)
    async obtenerTodos(filtros = {}) {
        const mapaFiltros = {
            nombre:     { columna: 'nombre', like: true },
            stock_min:  { columna: 'stock', operador: '>=' },
            stock_max:  { columna: 'stock', operador: '<=' },
            precio_min: { columna: 'precio_unitario', operador: '>=' },
            proveedor:  { columna: 'id_proveedor' }
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

        let query = 'SELECT * FROM productos';
        if (condiciones.length > 0) query += ` WHERE ${condiciones.join(' AND ')}`;

        const [filas] = await pool.query(query, valores);
        return filas;
    }

    // AGGREGATION: COUNT, SUM, AVG, MAX y MIN en una sola consulta
    async obtenerEstadisticas() {
        const query = `
            SELECT COUNT(*) AS cantidad,
                   SUM(stock) AS stock_total,
                   AVG(precio_unitario) AS precio_promedio,
                   MAX(precio_unitario) AS precio_maximo,
                   MIN(precio_unitario) AS precio_minimo
            FROM productos
        `;
        const [filas] = await pool.query(query);
        return filas[0];
    }

    // READ by ID
    async obtenerPorId(id) {
        const query = 'SELECT * FROM productos WHERE id_producto = ?';
        const [filas] = await pool.execute(query, [id]);
        return filas[0];
    }

    // UPDATE
    async actualizar(id, producto) {
        const { nombre, descripcion, precio_unitario, stock, id_proveedor } = producto;
        const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio_unitario = ?, stock = ?, id_proveedor = ? WHERE id_producto = ?';
        const [resultado] = await pool.execute(query, [nombre, descripcion, precio_unitario, stock, id_proveedor, id]);
        return resultado;
    }

    // UPDATE PARCIAL (PATCH): actualiza solo los campos enviados
    async actualizarParcial(id, producto) {
        const permitidas = ['nombre', 'descripcion', 'precio_unitario', 'stock', 'id_proveedor'];
        const campos = Object.entries(producto).filter(([campo]) => permitidas.includes(campo));

        if (campos.length === 0) return null;

        const sets = campos.map(([campo]) => `${campo} = ?`).join(', ');
        const valores = campos.map(([, valor]) => valor);

        const query = `UPDATE productos SET ${sets} WHERE id_producto = ?`;
        const [resultado] = await pool.execute(query, [...valores, id]);
        return resultado;
    }

    // DELETE
    async eliminar(id) {
        const query = 'DELETE FROM productos WHERE id_producto = ?';
        const [resultado] = await pool.execute(query, [id]);
        return resultado;
    }
}

export default new ProductoModel();
