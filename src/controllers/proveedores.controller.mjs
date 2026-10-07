import proveedorModel from '../models/proveedores.model.mjs';

class ProveedorController {
    async crear(req, res) {
        try {
            const { razon_social, cuit } = req.body;
            if (!razon_social || !cuit) {
                return res.status(400).json({ error: "La razón social y el CUIT son obligatorios" });
            }
            const resultado = await proveedorModel.crear(req.body);
            res.status(201).json({ mensaje: "Proveedor creado exitosamente", id_proveedor: resultado.insertId });
        } catch (error) {
            console.error("Error al crear proveedor:", error);
            res.status(500).json({ error: "Error interno del servidor al procesar el proveedor." });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const proveedores = await proveedorModel.obtenerTodos(req.query);
            res.status(200).json(proveedores);
        } catch (error) {
            console.error("Error al obtener proveedores:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const proveedor = await proveedorModel.obtenerPorId(id);

            if (!proveedor) {
                return res.status(404).json({ error: "Proveedor no encontrado." });
            }

            res.status(200).json(proveedor);
        } catch (error) {
            console.error("Error al obtener el proveedor:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await proveedorModel.actualizar(id, req.body);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Proveedor no encontrado para actualizar." });
            }
            res.status(200).json({ mensaje: "Proveedor actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar proveedor:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await proveedorModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Proveedor no encontrado para eliminar." });
            }
            res.status(200).json({ mensaje: "Proveedor eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar proveedor:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async actualizarParcial(req, res) {
        try {
            const { id } = req.params;
            const resultado = await proveedorModel.actualizarParcial(id, req.body);

            if (!resultado) {
                return res.status(400).json({ error: "Debe enviar al menos un campo válido a modificar." });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Proveedor no encontrado." });
            }

            res.status(200).json({ mensaje: "Proveedor actualizado parcialmente" });
        } catch (error) {
            console.error("Error al actualizar proveedor (parcial):", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    // AGGREGATION: /api/proveedores/estadisticas (COUNT + GROUP BY + JOIN)
    async estadisticas(req, res) {
        try {
            const estadisticas = await proveedorModel.obtenerEstadisticas();
            res.status(200).json(estadisticas);
        } catch (error) {
            console.error("Error al obtener estadísticas de proveedores:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }
}

export default new ProveedorController();
