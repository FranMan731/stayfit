const express = require('express')
const session = require('express-session')
const routes = require('./routes/index')
const mongoose = require('mongoose')
const config = require('./config/index')
const { job_cita, job_plan } = require('./controllers/cron')
const cors = require('cors')
var app = express()

app.use(cors())
// conectar mongodb
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
   .then(() => console.log('MongoDB connected'))
   .catch(error => console.log(error))

// libreria para guardar cookies en la BD de mongo (en vez de en memoria que no bueno para production)
const MongoStore = require('connect-mongo')(session)

// cookies para mantener la session abierta (lo usamos solamente para el dashboard)
// las llamadas a la api se manejan con token
app.use(session({
   secret: '1234',
   name: 'sessionGimnasio',
   resave: false,
   saveUninitialized: false,
   store: new MongoStore({
      mongooseConnection: mongoose.connection
   }),
   cookie: {
      //secure: true,      // only cookies through https
      httpOnly: true,
      //maxAge: 3600      // 1 hour
   }
}))

// view engine setup
app.set('view engine', 'ejs');

// middlewares
app.use(express.json())

// routes
app.use(routes)

//Cron para repetir tareas
job_cita.start();
job_plan.start();

// export
module.exports = app