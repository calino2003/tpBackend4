import { crearProveedorDb, obtenerProveedoresDb, obtenerProveedorPorIdDb, actualizarProveedorDb, eliminarProveedorDb } from '../models/proveedores.model.mjs';

export const crearProveedor = async (req, res) => {
    try {
        const { razon_social, cuit } = req.body;
        if (!razon_social || !cuit) {
            return res.status(400).json({ error: "La razón social y el CUIT son obligatorios" });
        }
        const resultado = await crearProveedorDb(req.body);
        res.status(201).json({ mensaje: "Proveedor creado exitosamente", id_proveedor: resultado.insertId });
    } catch (error) {
        console.error("Error al crear proveedor:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar el proveedor." });
    }
};

export const obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await obtenerProveedoresDb();
        res.status(200).json(proveedores);
    } catch (error) {
        console.error("Error al obtener proveedores:", error);
        res.status(500).json({ error: "Error al consultar la base de datos." });
    }
};

export const obtenerProveedorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await obtenerProveedorPorIdDb(id);

        if (!proveedor) {
            return res.status(404).json({ error: "Proveedor no encontrado." });
        }

        res.status(200).json(proveedor);
    } catch (error) {
        console.error("Error al obtener el proveedor:", error);
        res.status(500).json({ error: "Error al consultar la base de datos." });
    }
};

export const actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await actualizarProveedorDb(id, req.body);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Proveedor no encontrado para actualizar." });
        }
        res.status(200).json({ mensaje: "Proveedor actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar proveedor:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const eliminarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await eliminarProveedorDb(id);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Proveedor no encontrado para eliminar." });
        }
        res.status(200).json({ mensaje: "Proveedor eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};