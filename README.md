Prerequisite:
Node.js and npm installed: https://nodejs.org/en/download
Install Angular CLI: 
```
npm install -g @angular/cli
```

Alle Dependencies installieren:
```
cd frontend_service
npm ci
```

Frontend starten:
```
cd frontend
ionic serve [platform]
```
[platform]= ios/android

Backend starten:
```
cd backend
docker-compose up
 ```
