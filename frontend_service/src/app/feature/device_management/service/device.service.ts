import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceMetaData, NewDeviceData, ProductType, RoomInterface } from '../models/device-models';
import { Observable, map, timer} from 'rxjs';
import { switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  apiEndpoint: string = 'http://localhost:8000/api/v1'

  constructor(private http: HttpClient) { }

  createNewDevice(newDeviceData: NewDeviceData[]) {
    return this.http.post(`${this.apiEndpoint}/items-new/`, newDeviceData)
  }

  /** Get all Items, polling to update the changes from DB */
  getAllItems() {
    return timer(1, 10000).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<DeviceMetaData[]>(`${this.apiEndpoint}/items-all/`))
    )
  }

  /** Get 1 item infos, polling to reflect changes in DB */
  getItemById(itemId: number): Observable<DeviceMetaData> {
    return timer(1, 10000).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<DeviceMetaData>(`${this.apiEndpoint}/item-details/${itemId}/`)),
    )
  }

  getAllProductTypes() {
    return this.http.get<ProductType[]>(`${this.apiEndpoint}/product-type/`)
  }

  getAllRooms() {
    return timer(1, 10000).pipe(
      switchMap(() => this.http.get<RoomInterface[]>(`${this.apiEndpoint}/room/`))
    )
  }

  getOneRoom(roomId: number) {
    return this.http.get<RoomInterface>(`${this.apiEndpoint}/room/id/${roomId}/`)
  }

  createNewRoom(roomNumber: string) {
    /** POST JSON to create new room */
    const postData = {
      room_number: roomNumber
    }
    return this.http.post(`${this.apiEndpoint}/room/`, postData)
  }
}