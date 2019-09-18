import { AsyncStorage } from 'react-native'
import OneSignal from 'react-native-onesignal'
import UsuarioStore from './stores/UsuarioStore'
import AppStore from './stores/AppStore'

export function registerListeners() {
   OneSignal.init('cd26ac60-2348-4cf7-8091-1476728e6b85')

   OneSignal.configure()

   // 0 -> None, 1 -> InAppAlert, 2 -> Notification
   OneSignal.inFocusDisplaying(2)

   OneSignal.addEventListener('received', onReceived)
   OneSignal.addEventListener('opened', onOpened)
   OneSignal.addEventListener('ids', onIds)
}

export function removeListeners() {
   OneSignal.removeEventListener('received', onReceived)
   OneSignal.removeEventListener('opened', onOpened)
   OneSignal.removeEventListener('ids', onIds)
}

// Se ejecuta cuando recibimos notif. y estamos adentro de la app
function onReceived(notification) {
   const tipo_notif = notification.payload.additionalData.tipo_notif

   switch (tipo_notif) {
      case 'new_plan':
         AppStore.setNotification('update_calendario', true)
         AppStore.setNotification('update_perfil_alumno', true)
         AppStore.setNotification('update_lista_alumnos', true)
         break
   }
}

// Se ejecuta cuando hacemos click en la notif. de la barra superior
function onOpened(openResult) {
   console.log(openResult)
}

// Recibimos el id del usuario de Onesignal (notificaciones)
function onIds(device) {
   UsuarioStore.setOnesignalID(device.userId)
}
