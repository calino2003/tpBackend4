import productoModel from '../models/productos.model.mjs';

class ProductoController {
    // 1. Inyectamos 'next'
    async crear(req, res, next) {
        try {
            const { nombre, precio_unitario } = req.body;
            if (!nombre || !precio_unitario) {
                return res.status(400).json({ error: "El nombre y el precio unitario son obligatorios." });
            }
            const resultado = await productoModel.crear(req.body);
            res.status(201).json({ mensaje: "Producto creado exitosamente", id_producto: resultado.insertId });
        } catch (error) {
            // 2. Delegamos. Ataja errores como proveedor inexistente
            next(error);
        }
    }

    async obtenerTodos(req, res, next) {
        try {
            const productos = await productoModel.obtenerTodos();
            res.status(200).json(productos);
        } catch (error) {
            next(error);
        }
    }

    async obtenerPorId(req, res, next) {
        try {
            const { id } = req.params;
            const producto = await productoModel.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }

            res.status(200).json(producto);
        } catch (error) {
            next(error);
        }
    }

    async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await productoModel.actualizar(id, req.body);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }
            res.status(200).json({ mensaje: "Producto actualizado exitosamente" });
        } catch (error) {
            next(error);
        }
    }

    async eliminar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await productoModel.eliminar(id);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }
            res.status(200).json({ mensaje: "Producto eliminado exitosamente" });
        } catch (error) {
            // Ataja el error si el producto ya está en un pedido
            next(error);
        }
    }

    async actualizarParcial(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await productoModel.actualizarParcial(id, req.body);

            if (!resultado) {
                return res.status(400).json({ error: "Debe enviar al menos un campo válido a modificar." });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }

            res.status(200).json({ mensaje: "Producto actualizado parcialmente" });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductoController();