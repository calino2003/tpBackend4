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
            // Validamos que los filtros numéricos sean realmente números
            for (const parametro of ['stock_min', 'stock_max', 'precio_min', 'proveedor']) {
                const valor = req.query[parametro];
                if (valor !== undefined && valor !== '' && isNaN(Number(valor))) {
                    return res.status(400).json({ error: `El parámetro '${parametro}' debe ser numérico.` });
                }
            }

            const productos = await productoModel.obtenerTodos(req.query);
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

    async actualizarParcial(req, res) {
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
            console.error("Error al actualizar producto (parcial):", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async estadisticas(req, res) {
        try {
            const estadisticas = await productoModel.obtenerEstadisticas();
            res.status(200).json(estadisticas);
        } catch (error) {
            console.error("Error al obtener estadísticas de productos:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }
}

export default new ProductoController();
