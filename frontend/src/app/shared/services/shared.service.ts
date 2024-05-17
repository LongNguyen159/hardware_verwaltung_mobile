import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Device, ImageResponse, ItemHistoryPost, NewDeviceData, ProductType, Room, User } from '../models/shared-models';
import { Observable, Subject, forkJoin, map, of, startWith, timer} from 'rxjs';
import { switchMap } from 'rxjs';
import { CheckboxCustomEvent, ToastController } from '@ionic/angular/standalone';
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


  selectedItems: Device[] = []
  selectedItemsSubject = new Subject<Device[]>()


  constructor(private http: HttpClient, private snackbar: ToastController) { }

  createNewDevice(newDeviceData: NewDeviceData[]) {
    return this.http.post(`${this.apiEndpoint}/items-new/`, newDeviceData)
  }

  /** Get all Items, polling to update the changes from DB */
  getAllItems(): Observable<Device[]> {
    return timer(1, this._pollingInterval).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<Device[]>(`${this.apiEndpoint}/items-all/`)),
    )
  }

  /** 
   * Our functions poll periodically to fetch data.
   * Call this function to manually trigger the API call apart from polling interval.
   */
  triggerEmission(): void {
    this.triggerUpdate$.next()
  }

  /** Get 1 item infos, polling to reflect changes in DB, manually make request if `triggerEmission` is triggered */
  getItemById(itemId: number): Observable<Device> {
    return this.triggerUpdate$.pipe(
      startWith(null),
      switchMap(() => timer(0, this._pollingInterval)),
      switchMap(() => this.http.get<Device>(`${this.apiEndpoint}/item-details/${itemId}/`))
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

  /** Get relative time text refers to current time. Should be polled regularly
   * by whoever uses it, to update what the referenced date to 'now'.
   * Returns a string like 'a min ago', '2 minutes ago', etc.
   * 
   * Parameter: `startDate`
   * Pass start date in as a reference to calculate duration till current time.
   */
  getRelativeTimeDurationText(startDate: Date): string {
    const units = [
      { label: 'year', duration: 365 * 24 * 60 * 60 * 1000 },
      { label: 'month', duration: 30 * 24 * 60 * 60 * 1000 },
      { label: 'day', duration: 24 * 60 * 60 * 1000 },
      { label: 'hour', duration: 60 * 60 * 1000 },
      { label: 'minute', duration: 60 * 1000 }
    ];

    const now = new Date();
    const elapsed = now.getTime() - startDate.getTime();

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
    /** Dismiss old toasts before opening a new one.
     * First check if overlay exists, if yes then dismiss it.
     * If we dismiss without an overlay (a toast message), it will raise an error
     * 'overlay does not exist'. Because we can't dismiss 'nothingness' can we?
     */
    const overlay = this.snackbar.getTop()
    if (await overlay) {
      this.snackbar.dismiss()
    }
    const toast = await this.snackbar.create({
      message: message,
      duration: duration,
      position: 'top',
      buttons: [{
        role: "cancel",
        text: "Dismiss"
      }],
    })

    await toast.present()
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.apiEndpoint}/user/id/${id}/`)
  }

  /** Get all items borrowed by user */
  getItemsBorrowedByUserId(userId: number) {
    return this.triggerUpdate$.pipe(
      startWith(null),
      switchMap(() => timer(0, this._pollingInterval)),
      switchMap(() => this.http.get<Device[]>(`${this.apiEndpoint}/borrowed_items_by_user/${userId}/`))
    )
  }


  lendItem(itemId: number, roomId: number) {
    const postData: ItemHistoryPost = {
      item: itemId,
      user: this.userService.testUserId,
      item_history_type: 1,
      room: roomId
    }

    return this.http.post(`${this.apiEndpoint}/item-history/`, postData)
  }

  returnItems(itemIds: number[], roomId: number): Observable<any[]> {
    const requests = itemIds.map(itemId => {
      const postData = {
        item: itemId,
        user: this.userService.testUserId,
        item_history_type: 2,
        room: roomId
      }
      return this.http.post(`${this.apiEndpoint}/item-history/`, postData)
    })
    return forkJoin(requests)
  }

  clearSelectedDevices() {
    /** Reset selected items on 'done' click. This is equivalent to clicking 'cancel' */
    this.selectedItems = []
    this.selectedItemsSubject.next(this.selectedItems)
  }


  setSelectedDevices(option: CheckboxCustomEvent) {
    const checked = option.detail.checked
    const item: Device = option.detail.value

    /** Only push in selected item if it does not already exist. */
    if (checked && !this.selectedItems.map(v => v.id).includes(item.id)) {
      this.selectedItems.push(item)
    }

    if (!checked) {
      this.selectedItems = this.selectedItems.filter(v => v.id !== item.id)
    }

    this.selectedItemsSubject.next(this.selectedItems)
  }

  getSelectedDevices(): Observable<Device[]> {
    return this.selectedItemsSubject.asObservable()
  }
  
  
}