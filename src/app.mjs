import express from 'express';
import pool from './config/db.mjs';
import proveedoresRoutes from './routes/proveedores.routes.mjs'; // 1. Importamos la ruta
import productosRoutes from './routes/productos.routes.mjs';
import clientesRoutes from './routes/clientes.routes.mjs';
import empleadosRoutes from './routes/empleados.routes.mjs';
import companiasRoutes from './routes/companias.routes.mjs';
import pedidosRoutes from './routes/pedidos.routes.mjs';
import detallesPedidoRoutes from './routes/detalles_pedido.routes.mjs'; 


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// acá vamos a poder conectarnos la ruta. Cualquier petición que se haga a /api/proveedores lo va a manejada nuestro router
app.use('/api/proveedores', proveedoresRoutes);

app.get('/api/ping', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT "Conexion exitosa a MySQL Distribuidora" AS mensaje');
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error al conectar a la BD:", error);
        res.status(500).json({ error: "Fallo interno del servidor de base de datos." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de la Distribuidora corriendo en http://localhost:${PORT}`);
});

app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/companias', companiasRoutes);
app.use('/api/pedidos', pedidosRoutes);  
app.use('/api/detalles', detallesPedidoRoutes);