import mysql from 'mysql2/promise';

// Creamos la "flota" de conexiones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Tu usuario de XAMPP (por defecto 'root')
    password: '',      // La contraseña de XAMPP (por defecto vacía)
    database: 'distribuidora', // El nombre de la BD que creamos en phpMyAdmin
    waitForConnections: true,
    connectionLimit: 10,       // Límite máximo de conexiones simultáneas
    queueLimit: 0
});

export default pool;