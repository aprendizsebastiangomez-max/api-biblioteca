// middlewares/auth.js
const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const encabezado = req.headers.authorization;

    if (!encabezado || !encabezado.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Acceso denegado: Token no proporcionado' });
    }

    const token = encabezado.split(' ')[1];

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'llave_secreta_por_defecto');
        req.usuario = verificado;
        next();
    } catch (error) {
        return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
};

module.exports = autenticar;