const moment = require('moment');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.ensureAuth = (req, res, next) => {
	// verificamos si se ha enviado un token
	if (req.headers.authorization) {
		// guardamos el token
		const token = req.headers.authorization.replace('Bearer ', '');

		try {
			// decodificamos el token, y obtenemos sus datos
			const payload = jwt.verify(token, secret);

			req.user = payload;
		} catch (e) {
			// si se produjo un error al decodificar, mostramos mensaje
			return res.status(404).send({ message: 'Invalid token' });
		}
	}

	next();
};

exports.verify_login = (req, res, next) => {
	// si no existe la cookie o no es admin, lo enviamos al login
	if (!req.session.token || req.session.token.rol !== 'admin') res.redirect('/admin/login');
	else next();
};
