import pool from '../config/db.mjs';

class ProductoModel {
    // CREATE
    async crear(producto) {
        const { nombre, descripcion, precio_unitario, stock, id_proveedor } = producto;
        const query = 'INSERT INTO productos (nombre, descripcion, precio_unitario, stock, id_proveedor) VALUES (?, ?, ?, ?, ?)';
        const [resultado] = await pool.execute(query, [nombre, descripcion, precio_unitario, stock, id_proveedor]);
        return resultado;
    }

    // READ
    async obtenerTodos() {
        const query = 'SELECT * FROM productos';
        const [filas] = await pool.query(query);
        return filas;
    }

    // READ by ID
    async obtenerPorId(id) {
        const query = 'SELECT * FROM productos WHERE id_producto = ?';
        const [filas] = await pool.execute(query, [id]);
        return filas[0];
    }

    // UPDATE
    async actualizar(id, producto) {
        const { nombre, descripcion, precio_unitario, stock, id_proveedor } = producto;
        const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio_unitario = ?, stock = ?, id_proveedor = ? WHERE id_producto = ?';
        const [resultado] = await pool.execute(query, [nombre, descripcion, precio_unitario, stock, id_proveedor, id]);
        return resultado;
    }

    // UPDATE PARCIAL (PATCH): actualiza solo los campos enviados
    async actualizarParcial(id, producto) {
        const permitidas = ['nombre', 'descripcion', 'precio_unitario', 'stock', 'id_proveedor'];
        const campos = Object.entries(producto).filter(([campo]) => permitidas.includes(campo));

        if (campos.length === 0) return null;

        const sets = campos.map(([campo]) => `${campo} = ?`).join(', ');
        const valores = campos.map(([, valor]) => valor);

        const query = `UPDATE productos SET ${sets} WHERE id_producto = ?`;
        const [resultado] = await pool.execute(query, [...valores, id]);
        return resultado;
    }

    // DELETE
    async eliminar(id) {
        const query = 'DELETE FROM productos WHERE id_producto = ?';
        const [resultado] = await pool.execute(query, [id]);
        return resultado;
    }
}

export default new ProductoModel();
