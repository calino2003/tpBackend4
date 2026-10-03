import pool from '../config/db.mjs';

// CREATE
export const crearCompaniaDb = async (compania) => {
    const { nombre, telefono } = compania;
    const query = 'INSERT INTO companias_envio (nombre, telefono) VALUES (?, ?)';
    const [resultado] = await pool.execute(query, [nombre, telefono]);
    return resultado;
};

// READ
export const obtenerCompaniasDb = async () => {
    const query = 'SELECT * FROM companias_envio';
    const [filas] = await pool.query(query);
    return filas;
};

// UPDATE
export const actualizarCompaniaDb = async (id, compania) => {
    const { nombre, telefono } = compania;
    const query = 'UPDATE companias_envio SET nombre = ?, telefono = ? WHERE id_compania = ?';
    const [resultado] = await pool.execute(query, [nombre, telefono, id]);
    return resultado;
};

// DELETE
export const eliminarCompaniaDb = async (id) => {
    const query = 'DELETE FROM companias_envio WHERE id_compania = ?';
    const [resultado] = await pool.execute(query, [id]);
    return resultado;
};