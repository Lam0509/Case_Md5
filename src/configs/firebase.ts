const admin = require('firebase-admin');
import dotenv from "dotenv";
dotenv.config();

// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY
    }),
    storageBucket: "case-md5-46ad6.appspot.com"
});
// Cloud storage
const bucket = admin.storage().bucket();

module.exports = {
    bucket
}