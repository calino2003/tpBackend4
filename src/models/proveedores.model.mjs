import pool from '../config/db.mjs';

// POST: Crear proveedor en la BD
export const crearProveedorDb = async (proveedor) => {
    const { razon_social, cuit, telefono, email } = proveedor;
    
    // Cumplimos con la seguridad exigida usando consultas parametrizadas (?) para evitar Inyección SQL
    const query = 'INSERT INTO PROVEEDORES (razon_social, cuit, telefono, email) VALUES (?, ?, ?, ?)';
    
    // Usamos execute en lugar de query cuando pasamos parámetros dinámicos
    const [resultado] = await pool.execute(query, [razon_social, cuit, telefono, email]);
    return resultado;
};

// GET: Obtener todos los proveedores
export const obtenerProveedoresDb = async () => {
    const [filas] = await pool.query('SELECT * FROM PROVEEDORES');
    return filas;
};

// PUT: Actualizar un proveedor existente
export const actualizarProveedorDb = async (id, proveedor) => {
    const { razon_social, cuit, telefono, email } = proveedor;
    
    // Cambiamos 'id' por 'id_proveedor' (o tu nombre real de columna)
    const query = 'UPDATE PROVEEDORES SET razon_social = ?, cuit = ?, telefono = ?, email = ? WHERE id_proveedor = ?';
    const [resultado] = await pool.execute(query, [razon_social, cuit, telefono, email, id]);
    
    return resultado;
};

// DELETE: Eliminar un proveedor
export const eliminarProveedorDb = async (id) => {
    // Cambiamos 'id' por 'id_proveedor'
    const query = 'DELETE FROM PROVEEDORES WHERE id_proveedor = ?';
    const [resultado] = await pool.execute(query, [id]);
    
    return resultado;
};