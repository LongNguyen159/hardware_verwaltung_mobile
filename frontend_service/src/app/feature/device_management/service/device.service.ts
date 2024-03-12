import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as qr from 'qrcode'
import { DeviceMetaData1 } from '../models/device-models';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  generateQRCode(data: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      qr.toDataURL(data, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }

  getItemById() {
    return this.http.get('http://0.0.0.0:8000/api/v1/item/id/1/')
  }

  getItemMockData(): DeviceMetaData1[] {
    return [
      {
        "id": 1,
        "product_type": {
          "id": 101,
          "name": "Smartphone",
          "description": "High-end smartphone with advanced features"
        },
        "current_room": {
          "id": 201,
          "room_number": "A101"
        },
        "annotation": "Device in good condition",
        "borrowed_by_user": {
          "first_name": "John",
          "last_name": "Doe",
          "email": "john.doe@example.com",
          "user_type": "Employee",
          "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"
        },
        "qr_code": "1234567890"
      },
      {
        "id": 2,
        "product_type": {
          "id": 102,
          "name": "Laptop",
          "description": "Lightweight laptop for business use"
        },
        "current_room": {
          "id": 202,
          "room_number": "B202"
        },
        "borrowed_by_user": {
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane.smith@example.com",
          "user_type": "Student",
          "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"
        }
      },
      {
        "id": 3,
        "product_type": {
          "id": 103,
          "name": "Tablet",
          "description": "Compact tablet for entertainment"
        },
        "current_room": {
          "id": 203,
          "room_number": "C303"
        },
        "borrowed_by_user": {
          "first_name": "David",
          "last_name": "Brown",
          "email": "david.brown@example.com",
          "user_type": "Faculty",
          "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"
        },
        "qr_code": "0987654321"
      },
      {
          "id": 4,
          "product_type": {
            "id": 104,
            "name": "Smartwatch",
            "description": "Fitness tracker with smart features"
          },
          "current_room": {
            "id": 204,
            "room_number": "D404"
          },
          "borrowed_by_user": {
            "first_name": "Emily",
            "last_name": "Johnson",
            "email": "emily.johnson@example.com",
            "user_type": "Employee",
            "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"
          },
          "qr_code": "5432167890"
      },
      {
          "id": 5,
          "product_type": {
            "id": 105,
            "name": "Desktop Computer",
            "description": "Powerful computer for professional use"
          },
          "current_room": {
            "id": 205,
            "room_number": "E505"
          },
          "borrowed_by_user": {
            "first_name": "Michael",
            "last_name": "Williams",
            "email": "michael.williams@example.com",
            "user_type": "Student",
            "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"
          }
      },
      {
          "id": 6,
          "product_type": {
            "id": 106,
            "name": "Camera",
            "description": "Professional-grade camera for photography"
          },
          "current_room": {
            "id": 206,
            "room_number": "F606"
          },
          "borrowed_by_user": {
            "first_name": "Olivia",
            "last_name": "Brown",
            "email": "olivia.brown@example.com",
            "user_type": "Faculty",
            "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"
          },
          "qr_code": "0987651234"
      },
      {
          "id": 7,
          "product_type": {
            "id": 107,
            "name": "Headphones",
            "description": "Wireless headphones for immersive audio experience"
          },
          "current_room": {
            "id": 207,
            "room_number": "G707"
          },
          "borrowed_by_user": {
            "first_name": "William",
            "last_name": "Jones",
            "email": "william.jones@example.com",
            "user_type": "Employee",
            "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"
          }
      },
      {
          "id": 8,
          "product_type": {
            "id": 108,
            "name": "Printer",
            "description": ""
          },
          "current_room": {
            "id": 208,
            "room_number": "H808"
          },
          "borrowed_by_user": {
            "first_name": "Sophia",
            "last_name": "Garcia",
            "email": "sophia.garcia@example.com",
            "user_type": "Student",
            "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"
          },
          "qr_code": "2468101357"
      },
      {
          "id": 9,
          "product_type": {
            "id": 109,
            "name": "Smart Speaker",
            "description": "Voice-controlled speaker for smart home"
          },
          "current_room": {
            "id": 209,
            "room_number": "I909"
          },
          "borrowed_by_user": {
            "first_name": "Liam",
            "last_name": "Martinez",
            "email": "liam.martinez@example.com",
            "user_type": "Faculty",
            "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"
          },
          "qr_code": "1122334455"
      },
      {
          "id": 10,
          "product_type": {
            "id": 110,
            "name": "USB Cable",
            "description": "High-speed USB cable for data transfer"
          },
          "current_room": {
            "id": 210,
            "room_number": "J1010"
          },
          "borrowed_by_user": {
            "first_name": "",
            "last_name": "",
            "email": "",
            "user_type": "",
            "password_hash": ""
          },
          "qr_code": "1357924680"
      },
      {
          "id": 11,
          "product_type": {
            "id": 111,
            "name": "Computer Mouse",
            "description": "Ergonomic mouse for comfortable use"
          },
          "current_room": {
            "id": 211,
            "room_number": "K1111"
          },
          "borrowed_by_user": {
            "first_name": "",
            "last_name": "",
            "email": "",
            "user_type": "",
            "password_hash": ""
          },
          "annotation": "",
          "qr_code": "9876543210"
      },
      {
          "id": 12,
          "product_type": {
            "id": 112,
            "name": "Breadboard",
            "description": "Electronic breadboard for prototyping circuits"
          },
          "current_room": {
            "id": 212,
            "room_number": "L1212"
          },
          "borrowed_by_user": {
            "first_name": "",
            "last_name": "",
            "email": "",
            "user_type": "",
            "password_hash": ""
          },
          "annotation": "",
          "qr_code": "3141592653"
      },
      {
          "id": 13,
          "product_type": {
            "id": 113,
            "name": "Bluetooth Speaker",
            "description": "Portable speaker with Bluetooth connectivity"
          },
          "current_room": {
            "id": 213,
            "room_number": "M1313"
          },
          "borrowed_by_user": {
            "first_name": "",
            "last_name": "",
            "email": "",
            "user_type": "",
            "password_hash": ""
          },
          "qr_code": "2718281828"
      },
    ]
  }
}
