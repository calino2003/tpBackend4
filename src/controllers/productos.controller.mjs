import productoModel from '../models/productos.model.mjs';

class ProductoController {
    async crear(req, res) {
        try {
            const { nombre, precio_unitario } = req.body;
            if (!nombre || !precio_unitario) {
                return res.status(400).json({ error: "El nombre y el precio unitario son obligatorios." });
            }
            const resultado = await productoModel.crear(req.body);
            res.status(201).json({ mensaje: "Producto creado exitosamente", id_producto: resultado.insertId });
        } catch (error) {
            console.error("Error al crear producto:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const productos = await productoModel.obtenerTodos();
            res.status(200).json(productos);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const producto = await productoModel.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }

            res.status(200).json(producto);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await productoModel.actualizar(id, req.body);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }
            res.status(200).json({ mensaje: "Producto actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await productoModel.eliminar(id);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }
            res.status(200).json({ mensaje: "Producto eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}

export default new ProductoController();
