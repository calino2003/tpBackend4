-- =============================================================================
-- TRABAJO PRÁCTICO BACKEND - IPAP RÍO NEGRO
-- Archivo: database.sql (Creación de esquema y población de datos)
-- =============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- ESTRUCTURA DE TABLAS
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `detalles_pedido`;
DROP TABLE IF EXISTS `pedidos`;
DROP TABLE IF EXISTS `productos`;
DROP TABLE IF EXISTS `proveedores`;
DROP TABLE IF EXISTS `empleados`;
DROP TABLE IF EXISTS `companias_envio`;
DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` varchar(15) NOT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `companias_envio` (
  `id_compania` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_compania`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `empleados` (
  `id_empleado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `cargo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_empleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(100) NOT NULL,
  `cuit` varchar(15) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`),
  UNIQUE KEY `cuit` (`cuit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `id_proveedor` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `id_cliente` int(11) DEFAULT NULL,
  `id_empleado` int(11) DEFAULT NULL,
  `id_compania` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_empleado` (`id_empleado`),
  KEY `id_compania` (`id_compania`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON UPDATE CASCADE,
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`id_compania`) REFERENCES `companias_envio` (`id_compania`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `detalles_pedido` (
  `id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_pedido` (`id_pedido`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalles_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detalles_pedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- -----------------------------------------------------------------------------
-- INSERCIÓN DE DATOS (POBLACIÓN / SEEDER)
-- -----------------------------------------------------------------------------

INSERT INTO clientes (id_cliente, nombre, apellido, dni, direccion, telefono) VALUES
(1, 'Juan Carlos', 'Del Castillo', '30123456', 'San Carlos de Bariloche', '2944-123456'),
(2, 'Maria', 'Gomez', '40111222', 'Mitre 123, Bariloche', '2944-998877'),
(3, 'Lionel', 'Messi', '33016244', 'Av. Bustillo km 5', '2944-101010'),
(4, 'Sofia', 'Martinez', '39123456', 'Moreno 456, El Bolson', '2944-223344'),
(5, 'Carlos', 'Tevez', '31555666', 'Onelli 800, Bariloche', '2944-555666'),
(6, 'Ana', 'Laura', '28999888', 'Pioneros km 2', '2944-777888'),
(7, 'Diego', 'Perez', '35444333', 'Elflein 150', '2944-333444'),
(8, 'Lucia', 'Fernandez', '42111333', 'Gallardo 900', '2944-111333'),
(9, 'Marcos', 'Rojo', '34222111', 'Vicealmirante O''Connor 120', '2944-222111'),
(10, 'Valeria', 'Lynch', '20111222', 'Albarracin 300', '2944-000999');

INSERT INTO companias_envio (id_compania, nombre, telefono) VALUES
(1, 'Andreani Logística', '0810-122-1122'),
(2, 'OCA Logistica', '0800-999-9999'),
(3, 'Correo Argentino', '0810-777-8888'),
(4, 'Via Cargo', '0810-222-3333'),
(5, 'Cruz del Sur', '0810-333-4444'),
(6, 'Oro Negro', '0810-444-5555'),
(7, 'Andesmar Cargas', '0810-555-6666'),
(8, 'Transporte Imaz', '2944-111222'),
(9, 'Logistica Patagonia', '2944-333222'),
(10, 'Expreso Tas', '2944-555444');

INSERT INTO empleados (id_empleado, nombre, apellido, cargo) VALUES
(1, 'Carlos', 'Giménez', 'Supervisor de Logística'),
(2, 'Ana', 'Lopez', 'Vendedora'),
(3, 'Pedro', 'Alfonso', 'Gerente de Ventas'),
(4, 'Marta', 'Minujin', 'Cajera'),
(5, 'Jorge', 'Lanata', 'Repositor'),
(6, 'Susana', 'Gimenez', 'Atencion al Cliente'),
(7, 'Marcelo', 'Tinelli', 'Chofer'),
(8, 'Mirtha', 'Legrand', 'Auditora'),
(9, 'Guillermo', 'Francella', 'Vendedor'),
(10, 'Ricardo', 'Darin', 'Encargado de Deposito');

INSERT INTO proveedores (id_proveedor, razon_social, cuit, telefono, email) VALUES
(1, 'Mayorista Bariloche SRL', '30-87654321-0', '2944-654321', 'contacto@mayoristabrc.com'),
(2, 'Mayorista Bolson SRL', '30-87654541-0', '2944-674321', 'contactobol@mayoristaebs.com'),
(3, 'Distribuidora del Sur', '30-11223344-5', '2944-555555', 'ventas@delsur.com'),
(4, 'Coca Cola FEMSA', '30-55556666-1', '0800-888-2622', 'pedidos@femsa.com'),
(5, 'Quilmes S.A.', '30-44445555-2', '0800-222-2222', 'ventas@quilmes.com'),
(6, 'Arcor SAIC', '30-33334444-3', '0800-333-3333', 'arcor@arcor.com'),
(7, 'Molinos Rio de la Plata', '30-22223333-4', '0800-444-4444', 'molinos@molinos.com'),
(8, 'Mastellone Hnos (La Serenisima)', '30-11112222-5', '0800-555-5555', 'laserenisima@mastellone.com'),
(9, 'Unilever Argentina', '30-99998888-6', '0800-666-6666', 'unilever@unilever.com'),
(10, 'Procter & Gamble', '30-88887777-7', '0800-777-7777', 'pg@pg.com');

INSERT INTO productos (id_producto, nombre, descripcion, precio_unitario, stock, id_proveedor) VALUES
(1, 'Coca Cola 2.25L', 'Gaseosa sabor cola envase retornable', 2500.50, 100, 4),
(2, 'Sprite 2.25L', 'Gaseosa lima limon retornable', 2300.00, 50, 4),
(3, 'Cerveza Quilmes 1L', 'Cerveza rubia clasica retornable', 2800.00, 200, 5),
(4, 'Galletitas Chocolinas 250g', 'Galletitas dulces de chocolate', 1200.00, 150, 6),
(5, 'Fideos Matarazzo 500g', 'Fideos tallarines de semola', 1500.00, 300, 7),
(6, 'Leche Entera La Serenisima 1L', 'Leche entera en sachet', 1350.00, 120, 8),
(7, 'Jabón en polvo Skip 3kg', 'Jabon para lavar la ropa', 8500.00, 40, 9),
(8, 'Shampoo Pantene 400ml', 'Shampoo restauracion', 4500.00, 60, 10),
(9, 'Fernet Branca 750ml', 'Aperitivo de hierbas', 9500.00, 80, 1),
(10, 'Yerba Playadito 1kg', 'Yerba mate suave con palo', 3800.00, 110, 2);

INSERT INTO pedidos (id_pedido, fecha, total, id_cliente, id_empleado, id_compania) VALUES
(1, '2026-10-01 10:00:00', 15500.50, 1, 1, 1),
(2, '2026-10-02 11:30:00', 9200.00, 2, 2, 2),
(3, '2026-10-03 14:15:00', 28500.00, 3, 3, 3),
(4, '2026-10-04 09:45:00', 5400.00, 4, 4, 4),
(5, '2026-10-05 16:20:00', 17000.00, 5, 5, 5),
(6, '2026-10-06 12:10:00', 4500.00, 6, 6, 6),
(7, '2026-10-07 15:50:00', 11400.00, 7, 7, 7),
(8, '2026-10-08 08:30:00', 25500.00, 8, 8, 8),
(9, '2026-10-09 13:05:00', 3800.00, 9, 9, 9),
(10, '2026-10-10 17:40:00', 19000.00, 10, 10, 10);

INSERT INTO detalles_pedido (id_detalle, id_pedido, id_producto, cantidad, subtotal) VALUES
(1, 1, 1, 2, 5001.00),
(2, 1, 9, 1, 9500.00),
(3, 2, 2, 4, 9200.00),
(4, 3, 9, 3, 28500.00),
(5, 4, 6, 4, 5400.00),
(6, 5, 7, 2, 17000.00),
(7, 6, 5, 3, 4500.00),
(8, 7, 10, 3, 11400.00),
(9, 8, 7, 3, 25500.00),
(10, 9, 10, 1, 3800.00),
(11, 10, 9, 2, 19000.00);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
