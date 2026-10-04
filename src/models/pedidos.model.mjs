import pool from '../config/db.mjs';

// CREATE
export const crearPedidoDb = async (pedido) => {
    // Si no mandan total, por defecto la base lo toma como 0.00, pero lo controlamos acá también
    const { total = 0.00, id_cliente, id_empleado, id_compania } = pedido;
    const query = 'INSERT INTO pedidos (total, id_cliente, id_empleado, id_compania) VALUES (?, ?, ?, ?)';
    const [resultado] = await pool.execute(query, [total, id_cliente, id_empleado, id_compania]);
    return resultado;
};

// READ (Acá aplicamos los JOINs)
export const obtenerPedidosDb = async () => {
    const query = `
        SELECT 
            p.id_pedido, 
            p.fecha, 
            p.total,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            e.nombre AS empleado_nombre,
            e.apellido AS empleado_apellido,
            env.nombre AS compania_nombre
        FROM pedidos p
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
        LEFT JOIN empleados e ON p.id_empleado = e.id_empleado
        LEFT JOIN companias_envio env ON p.id_compania = env.id_compania
    `;
    const [filas] = await pool.query(query);
    return filas;
};

// READ by ID
export const obtenerPedidoPorIdDb = async (id) => {
    const query = `
        SELECT p.*, c.nombre AS cliente, e.nombre AS empleado, env.nombre AS compania
        FROM pedidos p
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
        LEFT JOIN empleados e ON p.id_empleado = e.id_empleado
        LEFT JOIN companias_envio env ON p.id_compania = env.id_compania
        WHERE p.id_pedido = ?
    `;
    const [filas] = await pool.query(query, [id]);
    return filas[0];
};

// UPDATE (Actualizar estado o total)
export const actualizarPedidoDb = async (id, pedido) => {
    const { total, id_cliente, id_empleado, id_compania } = pedido;
    const query = 'UPDATE pedidos SET total = ?, id_cliente = ?, id_empleado = ?, id_compania = ? WHERE id_pedido = ?';
    const [resultado] = await pool.execute(query, [total, id_cliente, id_empleado, id_compania, id]);
    return resultado;
};

// DELETE
export const eliminarPedidoDb = async (id) => {
    const query = 'DELETE FROM pedidos WHERE id_pedido = ?';
    const [resultado] = await pool.execute(query, [id]);
    return resultado;
};