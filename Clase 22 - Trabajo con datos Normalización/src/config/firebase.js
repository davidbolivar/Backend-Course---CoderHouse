import admin from "firebase-admin";
const config = {};

admin.initializeApp({
	credential: admin.credential.cert(config),
});

export const db = admin.firestore();
export const timeStamp = admin.firestore.FieldValue.serverTimestamp();
