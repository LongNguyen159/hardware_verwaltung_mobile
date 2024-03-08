import { Injectable } from '@angular/core';
import * as qr from 'qrcode'
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor() { }

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
}
