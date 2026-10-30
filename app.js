require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const pool = require('./config/db');
const manejadorErrores = require('./middlewares/errorHandler');
const autenticar = require('./middlewares/auth');
const { validarAutor, validarUsuario } = require('./middlewares/validators');
const { login } = require('./controllers/authController');

const app = express();

// Middlewares globales
app.use(express.json());

// Documentación Swagger
const documentacion = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentacion));

// Ruta pública de Auth
app.post('/api/login', validarUsuario, login);

// Rutas con validaciones
const rutasAutores = require('./routes/autores');
const rutasLibros = require('./routes/libros');
const rutasPrestamos = require('./routes/prestamos');

// Proteger rutas según requerido (Ejemplo: Préstamos e Inserción de Libros)
app.use('/api/autores', rutasAutores);
app.use('/api/libros', rutasLibros);
app.use('/api/prestamos', autenticar, rutasPrestamos); // Ruta 1 protegida con JWT

// Middleware central de errores (SIEMPRE debe ir al final de las rutas)
app.use(manejadorErrores);

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, () => {
    console.log(`Servidor en http://localhost:${puerto}`);
    console.log(`Documentación Swagger disponible en http://localhost:${puerto}/api-docs`);
});