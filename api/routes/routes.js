const express = require('express')
const Usuario = require('./../models/Usuario')
const { agregarBlacklistRecuperar, verificarTokenCambio } = require('./../controllers/blacklist');
const jsonwebtoken = require('jsonwebtoken');
const { sendEmail } = require('../controllers/email');

const api = express.Router()

api.get('/', function(req, res, next) {
   res.send('hola')
})

api.use('/uploads/', express.static(__dirname + './../public/uploads'))

// ruta para verificar la cuenta (este link se envia al correo del usuario)
api.get('/validacion/:token', async (req, res) => {
   let token = req.params.token;
   const verificar = await verificarTokenCambio(token);

		if(verificar.status) {
			try {
				const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
				
				const _id = decoded.id_usuario;
		
				await Usuario.findOneAndRemove({ _id: _id }).catch(() => {
               throw new ErrorDelete();
            }).then(async () => {
					agregarBlacklistRecuperar(token);
               
               await sendEmail({
                  to: decoded.email,
                  from: 'envios@cncs.cl',
                  template: 'eliminado'
               })

					return res.status(200).send({
						status: true,
						message: "Se ha eliminado el usuario."
					})
				}).catch(() => {
					return res.status(200).send({
						status: false,
						message: "No se ha podido eliminar el usuario."
					})
				});
			} catch(err) {
				// err
				console.log(err)
				return res.status(200).send({
					status: false,
					message: "El token que ha enviado es incorrecto, intente luego nuevamente."
				})
			}
		} else {
			return res.status(200).send({
				status: false,
				message: verificar.message
			})
		}
})

api.get('/facebook/:tipo', async(req, res) => {
   const tipo = req.params.tipo;
   let url = '';

   if(tipo === 'ios') {
      url = 'url_ios'
   }

   if(tipo === 'android') {
      url = 'url_android'
   }

   return res.render('facebook', {url: url});
})

api.get('/politica-privacidad', async (req, res) => {
   return res.render('politica_privacidad')
})

module.exports = api