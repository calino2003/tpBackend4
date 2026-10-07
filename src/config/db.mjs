import mysql from 'mysql2/promise';


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // usuario de XAMPP (por defecto 'root')
    password: '',      // contraseña de XAMPP (por defecto vacía)
    database: 'database', // El nombre de la BD que creamos en phpMyAdmin
    waitForConnections: true,
    connectionLimit: 10,       // Límite máximo de conexiones simultáneas
    queueLimit: 0
});

export default pool;