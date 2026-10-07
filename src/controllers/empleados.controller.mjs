import empleadoModel from '../models/empleados.model.mjs';

class EmpleadoController {
    // 1. Agregamos 'next' a los parámetros
    async crear(req, res, next) {
        try {
            const { nombre, apellido } = req.body;

            if (!nombre || !apellido) {
                return res.status(400).json({ error: "El nombre y el apellido del empleado son obligatorios." });
            }

            const resultado = await empleadoModel.crear(req.body);
            res.status(201).json({ mensaje: "Empleado creado exitosamente", id_empleado: resultado.insertId });
        } catch (error) {
            // 2. Derivamos el error al middleware global
            next(error);
        }
    }

    async obtenerTodos(req, res, next) {
        try {
            const empleados = await empleadoModel.obtenerTodos();
            res.status(200).json(empleados);
        } catch (error) {
            next(error);
        }
    }

    async obtenerPorId(req, res, next) {
        try {
            const { id } = req.params;
            const empleado = await empleadoModel.obtenerPorId(id);

            if (!empleado) {
                return res.status(404).json({ error: "Empleado no encontrado." });
            }

            res.status(200).json(empleado);
        } catch (error) {
            next(error);
        }
    }

    async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await empleadoModel.actualizar(id, req.body);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Empleado no encontrado." });
            }
            res.status(200).json({ mensaje: "Empleado actualizado exitosamente" });
        } catch (error) {
            next(error);
        }
    }

    async eliminar(req, res, next) {
        try {
            const { id } = req.params;
            const resultado = await empleadoModel.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Empleado no encontrado." });
            }
            res.status(200).json({ mensaje: "Empleado eliminado exitosamente" });
        } catch (error) {
            next(error);
        }
    }

    async actualizarParcial(req, res, next) {
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
            next(error);
        }
    }
}

export default new EmpleadoController();