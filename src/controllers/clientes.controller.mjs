import { crearClienteDb, obtenerClientesDb, actualizarClienteDb, eliminarClienteDb } from '../models/clientes.model.mjs';

export const crearCliente = async (req, res) => {
    try {
        const { nombre, apellido, dni } = req.body;
        
        // Validación de negocio alineada a la BD
        if (!nombre || !apellido || !dni) {
            return res.status(400).json({ error: "El nombre, apellido y DNI son campos obligatorios." });
        }

        const resultado = await crearClienteDb(req.body);
        res.status(201).json({ mensaje: "Cliente creado exitosamente", id_cliente: resultado.insertId });
    } catch (error) {
        console.error("Error al crear cliente:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const obtenerClientes = async (req, res) => {
    try {
        const clientes = await obtenerClientesDb();
        res.status(200).json(clientes);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ error: "Error al consultar la base de datos." });
    }
};

export const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await actualizarClienteDb(id, req.body);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Cliente no encontrado." });
        }
        res.status(200).json({ mensaje: "Cliente actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await eliminarClienteDb(id);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Cliente no encontrado." });
        }
        res.status(200).json({ mensaje: "Cliente eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};