//============================
//  ENTORNO
//============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';      // dev  production

process.env.DOMINIO = process.env.NODE_ENV === 'dev'
  ? 'http://localhost'
  : 'https://gym-stayfit.herokuapp.com/'


//============================
//  Base de Datos
//============================
process.env.URLDB = process.env.NODE_ENV === 'dev'
  ? 'mongodb://localhost:27017/gym'
  : 'mongodb+srv://admin:aDxjFVuWAOGsShig@cluster0-nm6vq.mongodb.net/test?retryWrites=true'
  

//============================
//  Secret Token
//============================
process.env.JWT_SECRET = process.env.JWT_SECRET || "123456";


//============================
//	Facebook Login
//============================
process.env.ID_APP_FB = process.env.ID_APP_FB || 'xxx';
process.env.CLAVE_FB = process.env.CLAVE_FB || 'xxxx';
process.env.APP_TOKEN_FB = process.env.APP_TOKEN_FB || `${process.env.ID_APP_FB}|${process.env.CLAVE_FB}`;


//============================
// OneSignal
//============================
process.env.ONESIGNAL_ID = process.env.ONESIGNAL_ID || 'cd26ac60-2348-4cf7-8091-1476728e6b85'
process.env.ONESIGNAL_KEY = process.env.ONESIGNAL_KEY || "Basic NDZiZDU0MzEtM2Q0Ni00OGMyLWFjYzQtOTFkYzVmZTJmZjBj";


//============================
// MercadoPago Authorization
//============================
process.env.MP_CLIENT_ID = process.env.MP_CLIENT_ID || "xxx";
process.env.MP_CLIENT_SECRET = process.env.MP_CLIENT_SECRET || "xxx";

//============================
//  Cloudinary
//============================
process.env.CLOUD_NAME = 'franman731'
process.env.CLOUD_KEY = '954118323289127'
process.env.CLOUD_SECRET = 'tYdCgzX2C-jHcnb_Bbxc5MymobI'