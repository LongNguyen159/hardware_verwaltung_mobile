import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Device, ImageResponse, ItemHistoryPost, NewDeviceData, ProductType, Room, User } from '../models/shared-models';
import { Observable, Subject, map, of, startWith, timer} from 'rxjs';
import { switchMap } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userService = inject(UserService)

  /** TODO: Change API endpoint Host in production. Not 'localhost' anymore, but the IP
   * of server where it's been hosted.
   * 
   * - Move user logics to UserService
   */
  private _hostName: string = 'macbookpro-m1.local'
  private _apiBaseHostUrl: string = `http://${this._hostName}:8000`
  apiEndpoint: string = `${this._apiBaseHostUrl}/api/v1`

  private _pollingInterval: number = 10000
  private triggerUpdate$ = new Subject<void>()

  
  imageId: number
  unixTimeValue: number


  constructor(private http: HttpClient, private snackbar: ToastController) { }

  createNewDevice(newDeviceData: NewDeviceData[]) {
    return this.http.post(`${this.apiEndpoint}/items-new/`, newDeviceData)
  }

  /** Get all Items, polling to update the changes from DB */
  getAllItems(): Observable<Device[]> {
    return this.triggerUpdate$.pipe(
      startWith(null),
      switchMap(() => timer(0, this._pollingInterval)),
      switchMap(() => this.http.get<Device[]>(`${this.apiEndpoint}/items-all/`))
    )
  }

  triggerEmission(): void {
    this.triggerUpdate$.next()
  }

  /** Get 1 item infos, polling to reflect changes in DB */
  getItemById(itemId: number): Observable<Device> {
    return timer(1, this._pollingInterval).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<Device>(`${this.apiEndpoint}/item-details/${itemId}/`)),
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
      switchMap(() => this.http.get<Room[]>(`${this.apiEndpoint}/room/`))
    )
  }

  getOneRoom(roomId: number) {
    return this.http.get<Room>(`${this.apiEndpoint}/room/id/${roomId}/`)
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
    return this.http.get(`${this._apiBaseHostUrl}${imageUrl}`, { responseType: 'blob' })
  }

  clearImage(deviceId: number) {
    return this.http.delete(`${this.apiEndpoint}/items/${deviceId}/image/`)
  }

  getRelativeTimeText(date: Date): string {
    const units = [
      { label: 'year', duration: 365 * 24 * 60 * 60 * 1000 },
      { label: 'month', duration: 30 * 24 * 60 * 60 * 1000 },
      { label: 'day', duration: 24 * 60 * 60 * 1000 },
      { label: 'hour', duration: 60 * 60 * 1000 },
      { label: 'minute', duration: 60 * 1000 }
    ];

    const now = new Date();
    const elapsed = now.getTime() - date.getTime();

    for (const unit of units) {
        const unitElapsed = elapsed / unit.duration;
        if (unitElapsed >= 1) {
            const rounded = Math.floor(unitElapsed);
            return rounded === 1 ? `a ${unit.label} ago` : `${rounded} ${unit.label}s ago`;
        }
    }

    return 'just now';
  }

  /** Opens snackbar message at the top of the screen. Default duration is 3 seconds. */
  async openSnackbarMessage(message: string, duration = 3000) {
    const toast = await this.snackbar.create({
      message: message,
      duration: duration,
      position: 'top',
      buttons: [{
        role: "cancel",
        text: "Dismiss"
      }],
    })

    await toast.present();
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.apiEndpoint}/user/id/${id}/`)
  }

  getItemsBorrowedByUserId(userId: number) {
    return timer(1, this._pollingInterval).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<Device[]>(`${this.apiEndpoint}/borrowed_items_by_user/${userId}/`))
    )
  }


  /** Later POST to item-history here */
  lendItem(itemId: number, roomId: number) {
    const postData: ItemHistoryPost = {
      item: itemId,
      user: this.userService.testUserId,
      item_history_type: 1,
      room: roomId
    }

    return this.http.post(`${this.apiEndpoint}/item-history/`, postData)
  }

  /** Later POST to item-history here */
  returnItem(itemId: number, roomId: number) {
    const postData: ItemHistoryPost = {
      item: itemId,
      user: this.userService.testUserId,
      item_history_type: 2,
      room: roomId
    }
    return this.http.post(`${this.apiEndpoint}/item-history/`, postData)
  }
  
}