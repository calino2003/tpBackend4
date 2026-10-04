import clienteModel from '../models/clientes.model.mjs';

class ClienteController {
    async crear(req, res) {
        try {
            const { nombre, apellido, dni } = req.body;

            // Validación de negocio alineada a la BD
            if (!nombre || !apellido || !dni) {
                return res.status(400).json({ error: "El nombre, apellido y DNI son campos obligatorios." });
            }

            const resultado = await clienteModel.crear(req.body);
            res.status(201).json({ mensaje: "Cliente creado exitosamente", id_cliente: resultado.insertId });
        } catch (error) {
            console.error("Error al crear cliente:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const clientes = await clienteModel.obtenerTodos();
            res.status(200).json(clientes);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const cliente = await clienteModel.obtenerPorId(id);

            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado." });
            }

            res.status(200).json(cliente);
        } catch (error) {
            console.error("Error al obtener el cliente:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await clienteModel.actualizar(id, req.body);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Cliente no encontrado." });
            }
            res.status(200).json({ mensaje: "Cliente actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await clienteModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Cliente no encontrado." });
            }
            res.status(200).json({ mensaje: "Cliente eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async actualizarParcial(req, res) {
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
            console.error("Error al actualizar cliente (parcial):", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}

export default new ClienteController();
