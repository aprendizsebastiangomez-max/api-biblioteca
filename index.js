require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const pool = require('./config/db');
const manejadorErrores = require('./middlewares/errorHandler');
const autenticar = require('./middlewares/auth');
const { validarAutor, validarUsuario } = require('./middlewares/validators');
const { login } = require('./controllers/authController');

const app = express();

// Middlewares globales
app.use(express.json());

// Documentación Swagger (Carga segura mediante ruta absoluta)
try {
    const rutaSwagger = path.join(__dirname, 'swagger.yaml');
    const documentacion = YAML.load(rutaSwagger);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentacion));
} catch (error) {
    console.error('Error al cargar la documentación Swagger:', error.message);
}

// Ruta raíz de prueba
app.get('/', (req, res) => {
    res.send('API Biblioteca en línea');
});

// Ruta pública de Auth
app.post('/api/login', validarUsuario, login);

// Rutas con validaciones
const rutasAutores = require('./routes/autores');
const rutasLibros = require('./routes/libros');
const rutasPrestamos = require('./routes/prestamos');

// Registrar rutas de la API
app.use('/api/autores', rutasAutores);
app.use('/api/libros', rutasLibros);
app.use('/api/prestamos', autenticar, rutasPrestamos);

// Middleware central de errores (SIEMPRE al final)
app.use(manejadorErrores);

// Configuración de servidor para Render ('0.0.0.0' y puerto dinámico)
const puerto = process.env.PORT || process.env.PUERTO || 3000;
app.listen(puerto, '0.0.0.0', () => {
    console.log(`Servidor en ejecución en puerto ${puerto}`);
    console.log(`Documentación Swagger en /api-docs`);
});