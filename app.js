require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
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

// Documentación Swagger con lectura directa y segura
try {
    const swaggerPath = path.join(__dirname, 'swagger.yaml');
    const fileContent = fs.readFileSync(swaggerPath, 'utf8');
    const documentacion = YAML.parse(fileContent);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentacion));
    console.log('Swagger cargado correctamente.');
} catch (error) {
    console.error('Error detallado al cargar swagger.yaml:', error.message);
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

app.use('/api/autores', rutasAutores);
app.use('/api/libros', rutasLibros);
app.use('/api/prestamos', autenticar, rutasPrestamos);

// Middleware central de errores
app.use(manejadorErrores);

const puerto = process.env.PORT || process.env.PUERTO || 3000;
app.listen(puerto, '0.0.0.0', () => {
    console.log(`Servidor escuchando en puerto ${puerto}`);
});