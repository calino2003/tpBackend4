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
