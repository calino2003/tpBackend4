import pool from '../config/db.mjs';

// CREATE
export const crearClienteDb = async (cliente) => {
    const { nombre, apellido, dni, direccion, telefono } = cliente;
    const query = 'INSERT INTO clientes (nombre, apellido, dni, direccion, telefono) VALUES (?, ?, ?, ?, ?)';
    const [resultado] = await pool.execute(query, [nombre, apellido, dni, direccion, telefono]);
    return resultado;
};

// READ
export const obtenerClientesDb = async () => {
    const query = 'SELECT * FROM clientes';
    const [filas] = await pool.query(query);
    return filas;
};

// UPDATE
export const actualizarClienteDb = async (id, cliente) => {
    const { nombre, apellido, dni, direccion, telefono } = cliente;
    const query = 'UPDATE clientes SET nombre = ?, apellido = ?, dni = ?, direccion = ?, telefono = ? WHERE id_cliente = ?';
    const [resultado] = await pool.execute(query, [nombre, apellido, dni, direccion, telefono, id]);
    return resultado;
};

// DELETE
export const eliminarClienteDb = async (id) => {
    const query = 'DELETE FROM clientes WHERE id_cliente = ?';
    const [resultado] = await pool.execute(query, [id]);
    return resultado;
};