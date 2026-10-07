import clienteModel from '../models/clientes.model.mjs';

class ClienteController {
    // Agregamos 'next'
    async crear(req, res, next) {
        try {
            const { nombre, apellido, dni } = req.body;

            // Validación de negocio alineada a la BD
            if (!nombre || !apellido || !dni) {
                return res.status(400).json({ error: "El nombre, apellido y DNI son campos obligatorios." });
            }

            const resultado = await clienteModel.crear(req.body);
            res.status(201).json({ mensaje: "Cliente creado exitosamente", id_cliente: resultado.insertId });
        } catch (error) {
            // Delegamos el error al middleware global (ej: DNI duplicado)
            next(error);
        }
    }

    async obtenerTodos(req, res, next) {
        try {
            const clientes = await clienteModel.obtenerTodos();
            res.status(200).json(clientes);
        } catch (error) {
            next(error);
        }
    }

    async obtenerPorId(req, res, next) {
        try {
            const { id } = req.params;
            const cliente = await clienteModel.obtenerPorId(id);

            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado." });
            }

            res.status(200).json(cliente);
        } catch (error) {
            next(error);
        }
    }

    async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await clienteModel.actualizar(id, req.body);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Cliente no encontrado." });
            }
            res.status(200).json({ mensaje: "Cliente actualizado exitosamente" });
        } catch (error) {
            next(error);
        }
    }

    async eliminar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await clienteModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Cliente no encontrado." });
            }
            res.status(200).json({ mensaje: "Cliente eliminado exitosamente" });
        } catch (error) {
            next(error);
        }
    }

    async actualizarParcial(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await clienteModel.actualizarParcial(id, req.body);

            if (!resultado) {
                return res.status(400).json({ error: "Debe enviar al menos un campo válido a modificar." });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Cliente no encontrado." });
            }

            res.status(200).json({ mensaje: "Cliente actualizado parcialmente" });
        } catch (error) {
            next(error);
        }
    }
}

export default new ClienteController();