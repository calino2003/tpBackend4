import pool from '../config/db.mjs';

class EmpleadoModel {
    // CREATE
    async crear(empleado) {
        const { nombre, apellido, cargo } = empleado;
        const query = 'INSERT INTO empleados (nombre, apellido, cargo) VALUES (?, ?, ?)';
        const [resultado] = await pool.execute(query, [nombre, apellido, cargo]);
        return resultado;
    }

    // READ
    async obtenerTodos() {
        const query = 'SELECT * FROM empleados';
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
