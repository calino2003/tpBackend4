import pool from '../config/db.mjs';

class CompaniaModel {
    // CREATE
    async crear(compania) {
        const { nombre, telefono } = compania;
        const query = 'INSERT INTO companias_envio (nombre, telefono) VALUES (?, ?)';
        const [resultado] = await pool.execute(query, [nombre, telefono]);
        return resultado;
    }

    // READ
    async obtenerTodos() {
        const query = 'SELECT * FROM companias_envio';
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

    // DELETE
    async eliminar(id) {
        const query = 'DELETE FROM companias_envio WHERE id_compania = ?';
        const [resultado] = await pool.execute(query, [id]);
        return resultado;
    }
}

export default new CompaniaModel();
