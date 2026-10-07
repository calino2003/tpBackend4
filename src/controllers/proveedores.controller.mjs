import proveedorModel from '../models/proveedores.model.mjs';

class ProveedorController {
    // 1. Agregamos el parámetro 'next'
    async crear(req, res, next) {
        try {
            const { razon_social, cuit } = req.body;
            
            // Validación de negocio intacta
            if (!razon_social || !cuit) {
                return res.status(400).json({ error: "La razón social y el CUIT son obligatorios" });
            }
            
            const resultado = await proveedorModel.crear(req.body);
            res.status(201).json({ mensaje: "Proveedor creado exitosamente", id_proveedor: resultado.insertId });
        } catch (error) {
            // 2. Delegamos el error (ej: CUIT duplicado)
            next(error);
        }
    }

    async obtenerTodos(req, res, next) {
        try {
            const proveedores = await proveedorModel.obtenerTodos();
            res.status(200).json(proveedores);
        } catch (error) {
            next(error);
        }
    }

    async obtenerPorId(req, res, next) {
        try {
            const { id } = req.params;
            const proveedor = await proveedorModel.obtenerPorId(id);

            if (!proveedor) {
                return res.status(404).json({ error: "Proveedor no encontrado." });
            }

            res.status(200).json(proveedor);
        } catch (error) {
            next(error);
        }
    }

    async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await proveedorModel.actualizar(id, req.body);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Proveedor no encontrado para actualizar." });
            }
            res.status(200).json({ mensaje: "Proveedor actualizado exitosamente" });
        } catch (error) {
            next(error);
        }
    }

    async eliminar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await proveedorModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Proveedor no encontrado para eliminar." });
            }
            res.status(200).json({ mensaje: "Proveedor eliminado exitosamente" });
        } catch (error) {
            // Ataja si se intenta borrar un proveedor que ya tiene productos asociados
            next(error);
        }
    }

    async actualizarParcial(req, res, next) {
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
            next(error);
        }
    }
}

export default new ProveedorController();