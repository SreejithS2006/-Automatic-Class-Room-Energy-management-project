# Backend Configuration

This repository uses a Serverless backend approach via **Firebase Realtime Database**.

### Overview
The frontend strictly communicates directly with Firebase Realtime Database using secure Firebase SDK methods. There is no dedicated Node.js, Python, or standard server running.

### Database Rules
To ensure your frontend client can read and write data from the ESP32 node, ensure your rules in the Firebase Console under **Realtime Database -> Rules** are set correctly:

```json
{
  "rules": {
    ".read": "true",
    ".write": "true"
  }
}
```

*Note: For production, we strongly recommend implementing robust security rules mapping to the Classroom Session IDs.*
