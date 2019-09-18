const express = require('express')
const multer = require('multer')
const {storage, limits, imageFilter} = require('./../controllers/multer-setup')
const Usuario = require('../models/Usuario')
const Ejercicio = require('../models/Ejercicio')

const { ErrorUpdate } = require('./../errors')
const api = express.Router()

/*
* multer es para subir archivos al servidor
* el 'storage' dice en donde vamos a guardar los archivos (que carpeta)
* el 'limits' se encarga de poner limites a la subida, por ej: tamaño de archivo, de nombre, etc..
* el 'fileFilter' nos permite decidir si queremos aceptar el archivo o no, verificamos su extension etc...
*/
const upload = multer({
   storage: storage,
   limits: limits,
   fileFilter: imageFilter
}).array('file', 10)


// si queremos subir las imagenes hacemos un POST a /upload
api.post('/', (req, res) => {
   // subimos los archivos al servidor
   upload(req, res, async (err) => {
      if (err) {
         console.log("Error: " + JSON.stringify(err))
         return res.status(400).send({ status: false, error: err.code })
      }

      for (let img of req.files) {
         
         // actualizamos la url de la imagen en BD
         switch (req.body.type) {
            case 'usuario':
               const id = req.user.id_usuario;

               await Usuario.findOneAndUpdate({ _id: id }, { avatar: img.secure_url }, {new: true}).catch(() => {
                  throw new ErrorUpdate()
               })
               break;
            case 'ejercicio':
               await Ejercicio.findOneAndUpdate({ _id: req.body.id }, { imagen: img.secure_url }, {new: true}).catch(err => {
                  
                  throw new ErrorUpdate()
               })
               break;
         }
      }
      return res.status(200).send({ status: true, url: req.files[0].secure_url });
   })
})

// las variables deben estar por encima del input file
// porque si no despues, no se pueden leer en el req.body
// Ejemplo:
/*<form method="POST" enctype="multipart/form-data">
    <input type="hidden" name="type" value="usuario">
    <input type="text" name="id">
    <input type="file" name="file">    <-- file va al final del form
    <input type="submit">                  (lo mismo si lo hacemos con javascript, debe ser el ultimo en agregar)
</form>*/

module.exports = api