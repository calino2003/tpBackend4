// src/middlewares/notFound.mjs
// Juan, si podés seguir avanzando con la API, te dejo este middleware para que lo uses en tu archivo principal (index.js)

export const notFound = (req, res, next) => {
    res.status(404).json({
        exito: false,
        mensaje: `La ruta [${req.method}] ${req.originalUrl} no existe en la API de la Distribuidora.`
    });
};