import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1wz4AGl94mBOQmkN_vsv-HkW9OZVXDfU",
  authDomain: "findoorr-dd269.firebaseapp.com",
  projectId: "findoorr-dd269",
  storageBucket: "findoorr-dd269.firebasestorage.app",
  messagingSenderId: "434689376256",
  appId: "1:434689376256:web:65fdd0e1662628b14bd8e5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;