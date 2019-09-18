const cloudinary = require('cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')

// iniciamos cloudinary
// se encarga de achicar y comprimir las imagenes
// las sube al servidor de ellos y usamos la url que nos dan
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_KEY,
   api_secret: process.env.CLOUD_SECRET
})

// cloudinaryStorage es una extension para poder usar
// multer + cloudinary

/* configuramos multer (para subir archivos)
*  le decimos donde guardar las imagenes,
*  y que nombre ponerle a los archivos */
export const storage = cloudinaryStorage({
   cloudinary: cloudinary,
   transformation: function (req, file, cb) {
      // creamos un objeto donde guardamos las transformaciones que queremos hacer a la imagen
      const t = [{
         // para las imagenes de subcategoria las queremos de 500px
         // si no es subcategoria la imagen es de 1000px
         width: 500,
         quality: 'auto:eco',
         crop: 'scale'
      }]

      // devolvemos el objeto a traves del callback
      cb(undefined, t)
   },
   folder: function (req, file, cb) {
      let folder = ''
      
      // vemos que tipo de archivo es para decidir en que carpeta lo guardamos
      // se crea una carpeta en cloudinary con el id que le pasamos
      // (ej: cloudnary.com/.../usuarios/382749382/imagen.jpg)
      switch (req.body.type) {
         case 'usuario':
            folder = 'usuarios/' + req.user.id_usuario
            break;
         case 'ejercicio':
            folder = 'ejercicios/'
            break;
      }

      cb(null, folder);
   },
   filename: function (req, file, cb) {
      // le colocamos como nombre al archivo
      // el tiempo en epoch time (1574389493.jpg)
      const name = Date.now();

      cb(null, name)
   }
});

/* limites de subida, etc .. */
export const limits = {
   fileSize: 10485760,   // 10mb,
   fieldNameSize: 100   // el nombre no sea largo
}

/* verificamos si el archivo es una imagen */
export const imageFilter = (req, file, cb) => {
   console.log(file)

   // si el archivo no tiene extension de imagen retornamos false.. error
   if (req.body.type !== 'importar' && !file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      const error = new Error('Only images allowed')
      error.code = 'IMG_BAD_FORMAT'
      return cb(error, false);
   }

   // si no, mandamos true y la imagen es aceptada
   cb(null, true);
};