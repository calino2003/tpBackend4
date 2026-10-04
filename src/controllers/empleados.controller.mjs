import empleadoModel from '../models/empleados.model.mjs';

class EmpleadoController {
    async crear(req, res) {
        try {
            const { nombre, apellido } = req.body;

            if (!nombre || !apellido) {
                return res.status(400).json({ error: "El nombre y el apellido del empleado son obligatorios." });
            }

            const resultado = await empleadoModel.crear(req.body);
            res.status(201).json({ mensaje: "Empleado creado exitosamente", id_empleado: resultado.insertId });
        } catch (error) {
            console.error("Error al crear empleado:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const empleados = await empleadoModel.obtenerTodos();
            res.status(200).json(empleados);
        } catch (error) {
            console.error("Error al obtener empleados:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const empleado = await empleadoModel.obtenerPorId(id);

            if (!empleado) {
                return res.status(404).json({ error: "Empleado no encontrado." });
            }

            res.status(200).json(empleado);
        } catch (error) {
            console.error("Error al obtener el empleado:", error);
            res.status(500).json({ error: "Error al consultar la base de datos." });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await empleadoModel.actualizar(id, req.body);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Empleado no encontrado." });
            }
            res.status(200).json({ mensaje: "Empleado actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar empleado:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await empleadoModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Empleado no encontrado." });
            }
            res.status(200).json({ mensaje: "Empleado eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar empleado:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    async actualizarParcial(req, res) {
        try {
            const { id } = req.params;
            const resultado = await empleadoModel.actualizarParcial(id, req.body);

            if (!resultado) {
                return res.status(400).json({ error: "Debe enviar al menos un campo válido a modificar." });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Empleado no encontrado." });
            }

            res.status(200).json({ mensaje: "Empleado actualizado parcialmente" });
        } catch (error) {
            console.error("Error al actualizar empleado (parcial):", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}

export default new EmpleadoController();
