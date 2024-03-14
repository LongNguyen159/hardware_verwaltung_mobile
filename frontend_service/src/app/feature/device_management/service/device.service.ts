import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as qr from 'qrcode'
import { DeviceMetaData1 } from '../models/device-models';
import { Observable, interval, startWith , timer} from 'rxjs';
import { switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  apiEndpoint: string = 'http://192.168.6.107:8000'

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


  getAllItems() {
    return timer(1, 10000).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<DeviceMetaData1[]>(`${this.apiEndpoint}/api/v1/item/`))
    )
  }

  getItemById(itemId: number) {
    return timer(1, 10000).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<DeviceMetaData1>(`${this.apiEndpoint}/api/v1/item/id/${itemId}/`))
    )
  }
}