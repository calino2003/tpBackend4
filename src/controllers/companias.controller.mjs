import companiaModel from '../models/companias.model.mjs';

class CompaniaController {
    async crear(req, res, next) {
        try {
            const { nombre } = req.body;

            if (!nombre) {
                return res.status(400).json({ error: "El nombre de la compañía de envío es obligatorio." });
            }

            const resultado = await companiaModel.crear(req.body);
            res.status(201).json({ mensaje: "Compañía de envío creada exitosamente", id_compania: resultado.insertId });
        } catch (error) {
            next(error);
        }
    }

    async obtenerTodos(req, res, next) {
        try {
            const companias = await companiaModel.obtenerTodos();
            res.status(200).json(companias);
        } catch (error) {
            next(error);
        }
    }

    async obtenerPorId(req, res, next) {
        try {
            const { id } = req.params;
            const compania = await companiaModel.obtenerPorId(id);

            if (!compania) {
                return res.status(404).json({ error: "Compañía de envío no encontrada." });
            }

            res.status(200).json(compania);
        } catch (error) {
            next(error);
        }
    }

    async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await companiaModel.actualizar(id, req.body);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Compañía de envío no encontrada." });
            }
            res.status(200).json({ mensaje: "Compañía de envío actualizada exitosamente" });
        } catch (error) {
            next(error);
        }
    }

    async eliminar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await companiaModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Compañía de envío no encontrada." });
            }
            res.status(200).json({ mensaje: "Compañía de envío eliminada exitosamente" });
        } catch (error) {
            next(error);
        }
    }

    async actualizarParcial(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await companiaModel.actualizarParcial(id, req.body);

            if (!resultado) {
                return res.status(400).json({ error: "Debe enviar al menos un campo válido a modificar." });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Compañía de envío no encontrada." });
            }

            res.status(200).json({ mensaje: "Compañía de envío actualizada parcialmente" });
        } catch (error) {
            next(error);
        }
    }
}

export default new CompaniaController();