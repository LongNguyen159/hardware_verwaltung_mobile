import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as qr from 'qrcode'
import { DeviceMetaData } from '../models/device-models';
import { Observable, timer} from 'rxjs';
import { switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  apiEndpoint: string = 'http://localhost:8000/api/v1'

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

  /** Get all Items, polling to update the changes from DB */
  getAllItems() {
    return timer(1, 10000).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<DeviceMetaData[]>(`${this.apiEndpoint}/items_all/`))
    )
  }

  /** Get 1 item infos, polling to reflect changes in DB */
  getItemById(itemId: number) {
    return timer(1, 10000).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<DeviceMetaData>(`${this.apiEndpoint}/item_details/${itemId}/`))
    )
  }
}