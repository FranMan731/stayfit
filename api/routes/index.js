const express = require('express')
const helmet = require('helmet')
const depthLimit = require('graphql-depth-limit')
const { ApolloServer } = require('apollo-server-express')
const { formatError} = require('./../controllers/graphql')
const schema = require('./../graphql/schema')
const jwt = require('express-jwt')
const { verifyBlacklist } = require('../controllers/blacklist')
const config = require('./../config/index')
const { ensureAuth } = require('../middlewares/auth.js')
const exportar = require('./../controllers/exportar')

// routes
const routes = require('./routes')
const admin_routes = require('./admin')
const upload_route = require('./upload')
const dash_routes = require('./dash')

const app = express()

// helmet (seguridad a traves de headers http)
app.use(helmet())

// routes
app.use('/', routes)
app.use('/admin', admin_routes)
app.use('/dash', dash_routes)

app.get('/exportar', function(req, res, next) {
   exportar.getXLSX().then((result) => {
      res.send({ filename: result })
   })
})

// auth middleware
// verifica que sea un token valido, etc...
// agrega al req.user los datos guardados en el token
const auth = jwt({
   secret: process.env.JWT_SECRET,
   credentialsRequired: false
})

// aplicamos el middleware de jwt
// con el callback, reemplazamos la vista de error por defecto que tiene express-jwt
// para mostrar un json
app.use(auth, (err, req, res, next) => {
   // si el token es invalido mostramos error al estilo graphql
   if (err.code === 'invalid_token')
      return res.send({
         errors: [{
            name: 'InvalidToken'
         }]
      })

   next();
})

// middleware para verificar si el token esta bloqueado
app.use(verifyBlacklist)
app.use(ensureAuth)

app.use('/upload', upload_route)

// graphql
const server = new ApolloServer({
   formatError,                                       // mostrar errores personalizados
   schema,
   validationRules: [ depthLimit(5) ],                // evitar que un "hacker" envie muchas querys anidadas
   context: ({ req, res }) => ({
      req,
      session: req.session,
      user: req.user
   })
});

server.applyMiddleware({ app });

module.exports = app