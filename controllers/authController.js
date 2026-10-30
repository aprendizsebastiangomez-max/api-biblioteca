// controllers/authController.js
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
    const { correo, clave } = req.body;

    try {
        // Aquí consultarías tu tabla de usuarios. Ejemplo simulado:
        // const [usuarios] = await pool.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        
        // Simulación de usuario correcto para prueba
        if (correo !== 'admin@biblioteca.com' || clave !== '123456') {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const usuario = { id: 1, correo };

        // Generar JWT
        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo },
            process.env.JWT_SECRET || 'llave_secreta_por_defecto',
            { expiresIn: '2h' }
        );

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token
        });
    } catch (error) {
        next(error); // Pasa el error al middleware central
    }
}

module.exports = { login };