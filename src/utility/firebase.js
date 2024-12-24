const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
require("dotenv").config();  

const loadFirebaseConfig = () => {
  const configTemplate = fs.readFileSync(path.join(__dirname, "../firebase/dental-nursing-ca3c2-firebase-adminsdk-wssfw-b026c153b6.json"), "utf8");
  const config = configTemplate.replace(/\${(.*?)}/g, (_, key) => {
    return process.env[key] || '';  
  });
  return JSON.parse(config);
};

if (admin.apps.length === 0) {
  const serviceAccount = loadFirebaseConfig(); 

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = { auth: admin.auth(), firestore: admin.firestore(), storage: admin.storage(), admin };
