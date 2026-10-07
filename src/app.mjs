import express from 'express';
import pool from './config/db.mjs';

// 1. Importamos todas las rutas
import proveedoresRoutes from './routes/proveedores.routes.mjs';
import productosRoutes from './routes/productos.routes.mjs';
import clientesRoutes from './routes/clientes.routes.mjs';
import empleadosRoutes from './routes/empleados.routes.mjs';
import companiasRoutes from './routes/companias.routes.mjs';
import pedidosRoutes from './routes/pedidos.routes.mjs';
import detallesPedidoRoutes from './routes/detalles_pedido.routes.mjs'; 

// 2. Importamos nuestros middlewares de error (que debes tener en src/middlewares/)
import { notFound } from './middlewares/notFound.mjs';
import { errorHandler } from './middlewares/errorHandler.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middlewares globales de entrada
app.use(express.json());
// Es buena práctica agregar urlencoded por si envían datos desde un formulario tradicional
app.use(express.urlencoded({ extended: true })); 

// 4. Montaje de rutas (La lógica de negocio)
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/companias', companiasRoutes);
app.use('/api/pedidos', pedidosRoutes);  
app.use('/api/detalles', detallesPedidoRoutes);

// Ruta de prueba
app.get('/api/ping', async (req, res, next) => { 
    try {
        const [result] = await pool.query('SELECT "Conexion exitosa a MySQL Distribuidora" AS mensaje');
        res.status(200).json(result[0]);
    } catch (error) {
        // En lugar de hacer res.status(500), le pasamos el error a nuestro middleware
        next(error);
    }
});

// 5. Middlewares de salida y manejo de errores (SIEMPRE AL FINAL DE LAS RUTAS)
app.use(notFound);       // Si la URL no hace match con nada de lo de arriba, devuelve 404
app.use(errorHandler);   // Si algún controlador hace next(error), el error decanta acá

// 6. Arranque del servidor (SIEMPRE AL FINAL DEL ARCHIVO)
app.listen(PORT, () => {
    console.log(`Servidor de la Distribuidora corriendo en http://localhost:${PORT}`);
});

export default app;