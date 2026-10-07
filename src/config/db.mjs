import mysql from 'mysql2/promise';


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'database', // El nombre de la BD que creamos en phpMyAdmin, ojo que no es el nombre del proyecto, sino el de la BD
    waitForConnections: true,
    connectionLimit: 10,       // Límite máximo de conexiones simultáneas
    queueLimit: 0
});

export default pool;