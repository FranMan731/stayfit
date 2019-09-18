var app = require('./app')
const socket = require('socket.io')

app = require('http').Server(app);

module.exports.io = socket(app)
require('./controllers/socketio')

// iniciar servidor node.js
app.listen({ port: process.env.PORT || 65000 }, () => {
   console.log('Server running on port 65000')
})