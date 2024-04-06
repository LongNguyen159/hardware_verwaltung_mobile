import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DeviceMetaData, ImageResponse, NewDeviceData, ProductType, RoomInterface } from '../models/device-models';
import { Observable, map, of, timer} from 'rxjs';
import { switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  apiBaseHostUrl: string = 'http://localhost:8000'
  apiEndpoint: string = `${this.apiBaseHostUrl}/api/v1`
  imageId: number
  unixTimeValue: number

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

  updateItemNotes(itemId: number, notes: string) {
    const patchData = {
      annotation: notes
    }
    return this.http.patch(`${this.apiEndpoint}/item/id/${itemId}/`, patchData)
  }

  deleteItemById(itemId: number) {
    return this.http.delete(`${this.apiEndpoint}/item/id/${itemId}/`)
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

  deleteRoom(roomId: number) {
    return this.http.delete(`${this.apiEndpoint}/room/id/${roomId}/`)
  }

  uploadDeviceImageToServer(formData: FormData, deviceId: number) {
    return this.http.post(`${this.apiEndpoint}/items/${deviceId}/image/`, formData)
  }

  /** Get image (blob) of one device */
  getImageOfDevice(deviceId: number): Observable<Blob | null> {
    return this.getImageInfos(deviceId).pipe(
      switchMap(response => {
        if (response.length !== 0) {

          return this.getImageBlob(response[0].image)
        } else {
          return of(null)
        }
      })
    )
  }
  /** Get all images URL associated with one device ID */
  getImageInfos(deviceId: number): Observable<ImageResponse[]> {
    return this.http.get<ImageResponse[]>(`${this.apiEndpoint}/items/${deviceId}/image/`)
  }

  getImageBlob(imageUrl: string): Observable<Blob> {
    return this.http.get(`${this.apiBaseHostUrl}${imageUrl}`, { responseType: 'blob' })
  }

  clearImage(deviceId: number) {
    return this.http.delete(`${this.apiEndpoint}/items/${deviceId}/image/`)
  }
}