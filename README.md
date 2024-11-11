# wwebjs-firebase-storage

![NPM Version](https://img.shields.io/npm/v/wwebjs-firebase-storage)
![NPM Downloads](https://img.shields.io/npm/dy/wwebjs-firebase-storage)
![GitHub License](https://img.shields.io/github/license/vedantmgoyal9/wwebjs-firebase-storage)

A remote authentication plugin for whatsapp-web.js, using Firebase Storage to securely store WhatsApp multi-device session data.

### Quick Links

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [Firebase Console](https://console.firebase.google.com)
- [Cloud Storage for Firebase (Documentation)](https://firebase.google.com/docs/storage)

### Installation

```bash
npm install wwebjs-firebase-storage
```

### Example usage

```typescript
import { Client, RemoteAuth } from 'whatsapp-web.js';
import { initializeApp, getStorage, FirebaseStorageStore } from 'wwebjs-firebase-storage';
import qrcode_terminal from 'qrcode-terminal';
const app = initializeApp({
    apiKey: <firebase-api-key>,
    projectId: <firebase-project-id>,
    storageBucket: <firebase-storage-bucket>,
});
const client = new Client({
    authStrategy: new RemoteAuth({
        store: new FirebaseStorageStore({
            firebaseStorage: getStorage(app),
            sessionPath: 'sessions-whatsapp-web.js',
        }),
        backupSyncIntervalMs: 600000,
    }),
    ... // other options
});
client.on('qr', qr => {
    qrcode_terminal.generate(qr, {small: true});
});
client.on('remote_session_saved', () => console.log('Remote session saved!'));
client.on('authenticated', () => console.log('Authenticated!'));
client.on('auth_failure', () => console.log('Authentication failed!'));
client.on('ready', () => console.log('Client is ready!'));
client.initialize();
```
