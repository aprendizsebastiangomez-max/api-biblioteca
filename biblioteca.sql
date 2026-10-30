-- BASE DE DATOS DE LA BIBLIOTECA
CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- TABLA DE AUTORES
CREATE TABLE IF NOT EXISTS autores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(100) NOT NULL
);

-- TABLA DE LIBROS
CREATE TABLE IF NOT EXISTS libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    anio INT,
    autor_id INT NOT NULL,
    disponible TINYINT(1) DEFAULT 1,
    FOREIGN KEY (autor_id) REFERENCES autores(id)
);

-- TABLA DE PRESTAMOS
CREATE TABLE IF NOT EXISTS prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libro_id INT NOT NULL,
    fecha_devolucion DATETIME NULL,
    FOREIGN KEY (libro_id) REFERENCES libros(id)
);

-- DATOS DE PRUEBA
INSERT INTO autores (nombre, nacionalidad)
VALUES
('Gabriel García Márquez', 'Colombiana'),
('Jorge Luis Borges', 'Argentina'),
('Isabel Allende', 'Chilena');

INSERT INTO libros (titulo, anio, autor_id, disponible)
VALUES
('Cien años de soledad', 1967, 1, 1),
('Ficciones', 1944, 2, 1),
('La casa de los espíritus', 1982, 3, 1);

-- CONSULTAR LOS DATOS
SELECT * FROM autores;
SELECT * FROM libros;
SELECT * FROM prestamos;