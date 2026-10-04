import companiaModel from '../models/companias.model.mjs';

class CompaniaController {
    async crear(req, res) {
        try {
            const { nombre } = req.body;

            if (!nombre) {
                return res.status(400).json({ error: "El nombre de la compañía de envío es obligatorio." });
            }

            const resultado = await companiaModel.crear(req.body);
            res.status(201).json({ mensaje: "Compañía de envío creada exitosamente", id_compania: resultado.insertId });
        } catch (error) {
            console.error("Error al crear compañía de envío:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const companias = await companiaModel.obtenerTodos();
            res.status(200).json(companias);
        } catch (error) {
            console.error("Error al obtener compañías de envío:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const compania = await companiaModel.obtenerPorId(id);

            if (!compania) {
                return res.status(404).json({ error: "Compañía de envío no encontrada." });
            }

            res.status(200).json(compania);
        } catch (error) {
            console.error("Error al obtener la compañía de envío:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await companiaModel.actualizar(id, req.body);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Compañía de envío no encontrada." });
            }
            res.status(200).json({ mensaje: "Compañía de envío actualizada exitosamente" });
        } catch (error) {
            console.error("Error al actualizar compañía de envío:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await companiaModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Compañía de envío no encontrada." });
            }
            res.status(200).json({ mensaje: "Compañía de envío eliminada exitosamente" });
        } catch (error) {
            console.error("Error al eliminar compañía de envío:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}

export default new CompaniaController();
