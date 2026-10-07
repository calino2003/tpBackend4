// src/middlewares/errorHandler.mjs

export const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR CAPTURADO] ${req.method} ${req.originalUrl} >>`, err.message || err);

    if (err.code) {
        switch (err.code) {
            case 'ER_DUP_ENTRY':
                return res.status(400).json({
                    exito: false,
                    error: 'Dato duplicado: El registro que intentás ingresar ya existe.'
                });
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_REFERENCED_ROW':
                return res.status(400).json({
                    exito: false,
                    error: 'Error de referencia: El ID asociado (ej. cliente, proveedor) no existe en la base de datos.'
                });
            case 'ER_ROW_IS_REFERENCED_2':
                return res.status(400).json({
                    exito: false,
                    error: 'Integridad referencial: No podés eliminar este registro porque está asociado a otros.'
                });
            case 'ECONNREFUSED':
                return res.status(500).json({
                    exito: false,
                    error: 'Fallo crítico: No hay conexión con la base de datos MySQL.'
                });
        }
    }

    const statusCode = err.status || err.statusCode || 500;
    const mensaje = statusCode === 500 
        ? 'Error interno del servidor.' 
        : err.message;

    return res.status(statusCode).json({
        exito: false,
        error: mensaje
    });
};