import pool from '../config/db.mjs';

class ClienteModel {
    // CREATE
    async crear(cliente) {
        const { nombre, apellido, dni, direccion, telefono } = cliente;
        const query = 'INSERT INTO clientes (nombre, apellido, dni, direccion, telefono) VALUES (?, ?, ?, ?, ?)';
        const [resultado] = await pool.execute(query, [nombre, apellido, dni, direccion, telefono]);
        return resultado;
    }

    // READ (acepta filtrados opcionales: /api/clientes?dni=...&nombre=...)
    async obtenerTodos(filtros = {}) {
        // Whititelist: parámetros de la URL → columnas reales de la tabla
        const mapaFiltros = {
            dni:      { columna: 'dni' },                  // coincidencia exacta
            nombre:   { columna: 'nombre', like: true },   // búsqueda parcial
            apellido: { columna: 'apellido', like: true }
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

        let query = 'SELECT * FROM clientes';
        if (condiciones.length > 0) query += ` WHERE ${condiciones.join(' AND ')}`;

        const [filas] = await pool.query(query, valores);
        return filas;
    }

    // AGGREGATION: resumen de clientes (COUNT)
    async obtenerEstadisticas() {
        const query = 'SELECT COUNT(*) AS cantidad, COUNT(telefono) AS con_telefono FROM clientes';
        const [filas] = await pool.query(query);
        return filas[0];
    }

    // READ by ID
    async obtenerPorId(id) {
        const query = 'SELECT * FROM clientes WHERE id_cliente = ?';
        const [filas] = await pool.execute(query, [id]);
        return filas[0];
    }

    // UPDATE
    async actualizar(id, cliente) {
        const { nombre, apellido, dni, direccion, telefono } = cliente;
        const query = 'UPDATE clientes SET nombre = ?, apellido = ?, dni = ?, direccion = ?, telefono = ? WHERE id_cliente = ?';
        const [resultado] = await pool.execute(query, [nombre, apellido, dni, direccion, telefono, id]);
        return resultado;
    }

    // UPDATE PARCIAL (PATCH): actualiza solo los campos enviados
    async actualizarParcial(id, cliente) {
        const permitidas = ['nombre', 'apellido', 'dni', 'direccion', 'telefono'];
        const campos = Object.entries(cliente).filter(([campo]) => permitidas.includes(campo));

        // Si no llega ningún campo válido, no hay nada que modificar
        if (campos.length === 0) return null;

        const sets = campos.map(([campo]) => `${campo} = ?`).join(', ');
        const valores = campos.map(([, valor]) => valor);

        const query = `UPDATE clientes SET ${sets} WHERE id_cliente = ?`;
        const [resultado] = await pool.execute(query, [...valores, id]);
        return resultado;
    }

    // DELETE
    async eliminar(id) {
        const query = 'DELETE FROM clientes WHERE id_cliente = ?';
        const [resultado] = await pool.execute(query, [id]);
        return resultado;
    }
}

export default new ClienteModel();
