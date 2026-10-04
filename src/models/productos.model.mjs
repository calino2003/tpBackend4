import pool from '../config/db.mjs';

// CREATE
export const crearProductoDb = async (producto) => {
    const { nombre, descripcion, precio_unitario, stock, id_proveedor } = producto;
    const query = 'INSERT INTO productos (nombre, descripcion, precio_unitario, stock, id_proveedor) VALUES (?, ?, ?, ?, ?)';
    const [resultado] = await pool.execute(query, [nombre, descripcion, precio_unitario, stock, id_proveedor]);
    return resultado;
};

// READ
export const obtenerProductosDb = async () => {
    const query = 'SELECT * FROM productos';
    const [filas] = await pool.query(query);
    return filas;
};

// READ by ID
export const obtenerProductoPorIdDb = async (id) => {
    const query = 'SELECT * FROM productos WHERE id_producto = ?';
    const [filas] = await pool.execute(query, [id]);
    return filas[0];
};

// UPDATE
export const actualizarProductoDb = async (id, producto) => {
    const { nombre, descripcion, precio_unitario, stock, id_proveedor } = producto;
    const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio_unitario = ?, stock = ?, id_proveedor = ? WHERE id_producto = ?';
    const [resultado] = await pool.execute(query, [nombre, descripcion, precio_unitario, stock, id_proveedor, id]);
    return resultado;
};

// DELETE
export const eliminarProductoDb = async (id) => {
    const query = 'DELETE FROM productos WHERE id_producto = ?';
    const [resultado] = await pool.execute(query, [id]);
    return resultado;
};