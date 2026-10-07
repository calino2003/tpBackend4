// src/middlewares/notFound.mjs

export const notFound = (req, res, next) => {
    res.status(404).json({
        exito: false,
        mensaje: `La ruta [${req.method}] ${req.originalUrl} no existe en la API de la Distribuidora.`
    });
};