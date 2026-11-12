

# Project Description:
Mobile/End user app for scanning hardware QR code in the school's library.
Motivation: The school lends hardwares to students: Keyboards, monitors, laptops, cables, etc. Currently they are managing the inventory and who lends what manually in a spreadsheet. The students have to register manually.
This app helps both students and school have a digital and automated way of managing hardware inventory and student lending contract.

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
