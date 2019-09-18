/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {registerListeners} from './NotificationConfig'

// Registramos los listeners de notificacion
// Tiene que ser aca, porque si no da problemas en algunos celulares que no registra los callbacks
registerListeners()

AppRegistry.registerComponent(appName, () => App);
