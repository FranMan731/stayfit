const CronJob = require('cron').CronJob;
const moment = require('moment');
const { sendNotification } = require('./onesignal')

const Cita = require('../models/Cita')
const Usuario = require('../models/Usuario')
const Plan = require('../models/Plan')

const job_cita = new CronJob('0 * * * *', async() => {
   const hoy = moment().format('YYYY-MM-DD');
   const citas = await Cita.find();

   for (let i = 0; i < citas.length; i++) {
       let cita = citas[i];
       let fecha = moment(cita.fecha).format('YYYY-MM-DD');

       if(fecha === hoy && !cita.notificado) {
            let alumno = await Usuario.findOne({_id: cita.id_alumno}).select('nombre')
            let profesor = await Usuario.findOne({_id: cita.id_profesor}).select('nombre')

            if(alumno && profesor && alumno.onesignal_id) {
                sendNotification({
                    app_id: process.env.ONESIGNAL_ID,
                    content_available: true,
                    include_player_ids: [alumno.onesignal_id],
                    headings: {
                    en: `Recordatorio de cita`
                    },
                    contents: {
                    en: `Hola ${alumno.nombre}, el coach ${profesor.nombre} le recuerda que tiene una cita HOY, a las ${cita.hora}.`
                    },
                    subtitle: {
                    en: "StayFit"
                    }
                })
    
                cita.notificado = true;
                cita.save();
            }
       }
   }
});

const job_plan = new CronJob('0 18 * * *', async() => {
    const mañana = moment().add(1, 'days').format('YYYY-MM-DD');
    const planes = await Plan.find()
    
    for (let i = 0; i < planes.length; i++) {
        const usuario = await Usuario.findOne({_id: planes.id_usuario}).select('_id nombre onesignal_id')
        const plan = planes[i];
        
        if(usuario) {
            if(usuario.onesignal_id) {
                for (let j = 0; j < plan.fechas.length; j++) {
                    const fecha = moment(plan.fechas[j].fecha).format('YYYY-MM-DD');
                    
                    if(fecha == mañana) {
                        sendNotification({
                            app_id: process.env.ONESIGNAL_ID,
                            content_available: true,
                            include_player_ids: [usuario.onesignal_id],
                            headings: {
                                en: `Recordatorio de rutina`
                            },
                             contents: {
                                en: `Hola ${usuario.nombre}, recuerde que mañana tiene ejercicios para realizar del plan de ${plan.nombre}.`
                            },
                            subtitle: {
                                en: "StayFit"
                            }
                        })
                    }
                }
            }
        }
    }
})

module.exports = { job_cita, job_plan };