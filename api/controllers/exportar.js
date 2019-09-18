const XLSX = require('xlsx');
const fs = require('fs')
const http = require('http')
const https = require('https')
const Usuario = require('./../models/Usuario')
const Ejercicio = require('./../models/Ejercicio')
module.exports = {
   getXLSXusuarios: function() {
      return new Promise(async (resolve, reject) => {
         /* data */
         let data = []

         const usuarios = await Usuario.find()

         for (let x = 0; x < usuarios.length; x++) {
            data.push({
               'Nombre': usuarios[x].nombre,
               'Email': usuarios[x].email,
               'Rol': usuarios[x].rol,
               'Avatar': usuarios[x].avatar,
               'Sexo': usuarios[x].sexo,
               'Ciudad': usuarios[x].ciudad
            })
         }

         /* make the worksheet */
         const worksheet = XLSX.utils.json_to_sheet(data);

         /* add to workbook */
         const workbook = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

         /* generate an XLSX file */
         const filename = `Usuarios - ${Date.now()}.xlsx`
         XLSX.writeFile(workbook, `public/uploads/exports/${filename}`);

         resolve(filename)
      })
   },

   getXLSXejercicios: function() {
      return new Promise(async (resolve, reject) => {
         /* data */
         let data = []

         const ejercicios = await Ejercicio.find()

         for (let x = 0; x < ejercicios.length; x++) {
            data.push({
               'Nombre': ejercicios[x].nombre,
               'Actividad': ejercicios[x].actividad,
               'Imagen': ejercicios[x].imagen
            })
         }

         /* make the worksheet */
         const worksheet = XLSX.utils.json_to_sheet(data);

         /* add to workbook */
         const workbook = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(workbook, worksheet, "Ejercicios");

         /* generate an XLSX file */
         const filename = `${Date.now()}.xlsx`
         XLSX.writeFile(workbook, `public/uploads/exportar/${filename}`);

         resolve(filename)
      })
   }
}
