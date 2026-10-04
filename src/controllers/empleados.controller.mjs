import { crearEmpleadoDb, obtenerEmpleadosDb, obtenerEmpleadoPorIdDb, actualizarEmpleadoDb, eliminarEmpleadoDb } from '../models/empleados.model.mjs';

export const crearEmpleado = async (req, res) => {
    try {
        const { nombre, apellido } = req.body;
        
        if (!nombre || !apellido) {
            return res.status(400).json({ error: "El nombre y el apellido del empleado son obligatorios." });
        }

        const resultado = await crearEmpleadoDb(req.body);
        res.status(201).json({ mensaje: "Empleado creado exitosamente", id_empleado: resultado.insertId });
    } catch (error) {
        console.error("Error al crear empleado:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const obtenerEmpleados = async (req, res) => {
    try {
        const empleados = await obtenerEmpleadosDb();
        res.status(200).json(empleados);
    } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).json({ error: "Error al consultar la base de datos." });
    }
};

export const obtenerEmpleadoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const empleado = await obtenerEmpleadoPorIdDb(id);

        if (!empleado) {
            return res.status(404).json({ error: "Empleado no encontrado." });
        }

        res.status(200).json(empleado);
    } catch (error) {
        console.error("Error al obtener el empleado:", error);
        res.status(500).json({ error: "Error al consultar la base de datos." });
    }
};

export const actualizarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await actualizarEmpleadoDb(id, req.body);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Empleado no encontrado." });
        }
        res.status(200).json({ mensaje: "Empleado actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const eliminarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await eliminarEmpleadoDb(id);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Empleado no encontrado." });
        }
        res.status(200).json({ mensaje: "Empleado eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};