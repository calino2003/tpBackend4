import pool from '../config/db.mjs';

// CREATE
export const crearEmpleadoDb = async (empleado) => {
    const { nombre, apellido, cargo } = empleado;
    const query = 'INSERT INTO empleados (nombre, apellido, cargo) VALUES (?, ?, ?)';
    const [resultado] = await pool.execute(query, [nombre, apellido, cargo]);
    return resultado;
};

// READ
export const obtenerEmpleadosDb = async () => {
    const query = 'SELECT * FROM empleados';
    const [filas] = await pool.query(query);
    return filas;
};

// READ by ID
export const obtenerEmpleadoPorIdDb = async (id) => {
    const query = 'SELECT * FROM empleados WHERE id_empleado = ?';
    const [filas] = await pool.execute(query, [id]);
    return filas[0];
};

// UPDATE
export const actualizarEmpleadoDb = async (id, empleado) => {
    const { nombre, apellido, cargo } = empleado;
    const query = 'UPDATE empleados SET nombre = ?, apellido = ?, cargo = ? WHERE id_empleado = ?';
    const [resultado] = await pool.execute(query, [nombre, apellido, cargo, id]);
    return resultado;
};

// DELETE
export const eliminarEmpleadoDb = async (id) => {
    const query = 'DELETE FROM empleados WHERE id_empleado = ?';
    const [resultado] = await pool.execute(query, [id]);
    return resultado;
};