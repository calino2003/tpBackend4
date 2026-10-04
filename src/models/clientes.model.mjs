import pool from '../config/db.mjs';

class ClienteModel {
    // CREATE
    async crear(cliente) {
        const { nombre, apellido, dni, direccion, telefono } = cliente;
        const query = 'INSERT INTO clientes (nombre, apellido, dni, direccion, telefono) VALUES (?, ?, ?, ?, ?)';
        const [resultado] = await pool.execute(query, [nombre, apellido, dni, direccion, telefono]);
        return resultado;
    }

    // READ
    async obtenerTodos() {
        const query = 'SELECT * FROM clientes';
        const [filas] = await pool.query(query);
        return filas;
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

    // DELETE
    async eliminar(id) {
        const query = 'DELETE FROM clientes WHERE id_cliente = ?';
        const [resultado] = await pool.execute(query, [id]);
        return resultado;
    }
}

export default new ClienteModel();
