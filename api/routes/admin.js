const express = require('express')
const {verify_login} = require('./../middlewares/auth')

const api = express.Router()

api.get('/', verify_login, function(req, res, next) {
   res.render('index', {page: 'Home', menuId: 'home'})
})

api.get('/login', function(req, res, next) {
   res.render('login')
})

api.get('/logout', function(req, res, next) {
   // eliminamos la cookie
   req.session.destroy()

   res.redirect('login')
})

api.get('/index', verify_login, function(req, res, next) {
   res.render('index', {page: 'Home', menuId: 'home'})
})

api.get('/usuarios', verify_login, function(req, res, next) {
   res.render('usuarios', {page:'Usuarios', menuId:'usuarios'})
})
module.exports = api