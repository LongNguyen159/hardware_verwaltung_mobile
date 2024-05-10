import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Barcode, BarcodeFormat, BarcodeScanner, ScanOptions } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Device, DeviceQRData, Room, RoomQRData } from 'src/app/shared/models/shared-models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UserService } from 'src/app/shared/services/user.service';

@Injectable({
  providedIn: 'root'
})

/** TODO:
 * Move logics from qr code page to service. In the future there might be 
 * many components that uses this scanner service.
 */
export class QrCodeService {
  sharedService = inject(SharedService)
  loadingService = inject(LoadingService)
  userService = inject(UserService)
  qrCode: Barcode[] = []

  deviceInfo: Device


  constructor(private alertController: AlertController) {
  }

  /** Async function because it waits for Barcodescanner to determine
   * whether if platform supports or not.
   */
  async isCodeScannerSupported(): Promise<boolean> {
    try {
      const result = await BarcodeScanner.isSupported();
      return result.supported
    } catch (error) {
      console.error('Error checking code scanner support:', error)
      return false
    }
  }

  /** Returns the last result scanned. Subscriber will be responsible for
   * storing/clearing them. Return type interface: `Barcode`
   * To see the actual data of scan results: `Barcode.rawValue` (string)
   * 
   * NOTE: It is recommended to check for the type interface of raw value returned by the scanner.
   * 
   * Please return a meaningful message or some type of notification for user
   * to let them know if QR code is not valid
   */
  async scan(): Promise<Barcode | undefined> {
    /** Reset storage on every scan */
    this.qrCode = []

    /** Early exit function if permission not granted */
    const granted = await this.requestPermissions();

    /** Scan results will be undefined if permission is not granted (early exit function) */
    if (!granted) {
      this.presentAlert();
      return
    }

    /** Scan options. In this case, we only scan QR code, so it's good to let the scanner know that
     * to accelerate scanning process.
     */
    const scanOptions: ScanOptions = {
      formats: [BarcodeFormat.QrCode]
    }
    const { barcodes } = await BarcodeScanner.scan(scanOptions)
    /** Push ensures that the last one will be the most recent */
    this.qrCode.push(...barcodes)
    /** Return the most recent scan result */
    return this.qrCode[this.qrCode.length -1]
  }


  /** Check if scanned data is of type `DeviceQRData`
   * by checking if all properties match and of the correct type
   */
  isValidDeviceData(jsonValue: any): jsonValue is DeviceQRData {
    return (
      typeof jsonValue === 'object' &&
      'id' in jsonValue && typeof jsonValue.id === 'number' &&
      'deviceType' in jsonValue && typeof jsonValue.deviceType === 'string' &&
      'deviceVariant' in jsonValue && typeof jsonValue.deviceVariant === 'string'
    )
  }

  isValidRoomData(jsonValue: any): jsonValue is RoomQRData {
    return (
      typeof jsonValue === 'object' &&
      'id' in jsonValue && typeof jsonValue.id === 'number' &&
      'room_number' in jsonValue && typeof jsonValue.room_number === 'string'
    )
  }


  /** Specifically serve the purpose of scanning to LEND ITEMS.
   * Simply call this function in any component and the device is lent!
   * The rest logic (including error handling) is handled in QRCodeService.
   * 
   * Optional parameter: `deviceInfo`
   * Provide this parameter if you want to specifically lend that exact item.
   * Currently being used in device-details page.
   */
  scanLendDevice(deviceInfo?: Device) {
    this.scan().then( (scanResults: Barcode | undefined) => {
      /** As per 'scan()' function above, scan results will be undefined if permission not granted,
       * or there are issues with the scanner. Hence, handle them here by returning a meaningful error message
       * and exit the function early.
       */
      if (!scanResults) {
        this.sharedService.openSnackbarMessage('Oops! There seems to be something wrong with the scanner, Please try again later.')
        return
      }

      /** Scan results raw value is in string format, hence we must parse them into JSON */
      const jsonValue = JSON.parse(scanResults.rawValue)
      if (this.isValidDeviceData(jsonValue)) {
        this._afterLendDeviceScanned(jsonValue, deviceInfo)
      } else {
        this.sharedService.openSnackbarMessage(`QR code not valid. Are you sure this is a device's QR code?`)
      }
      
    })
  }

  /** Helper function for scanning devices: After validating that the QR's value is valid, this function will be executed. */
  private _afterLendDeviceScanned(scannedDeviceData: DeviceQRData, deviceInfo?: Device) {
    /** If device Info is provided directly by the page, no need to call for API to retrieve device infos. Skip that step. */
    if (deviceInfo) {
      this.deviceInfo = deviceInfo
      this._handlingErrorAfterScanningDevice(scannedDeviceData)
    }

    /** If device info is not given by page, call API to retrieve for device info */
    if (!deviceInfo) {
      this.sharedService.getItemById(scannedDeviceData.id).pipe(take(1)).subscribe({
        next: (value: Device) => {
          this.deviceInfo = value
          this._handlingErrorAfterScanningDevice(scannedDeviceData)
        },
  
        /** Error getting item by id means the device is deleted from database,
         * or the requested ID does not exist. Either way, device is not available to lend.
         */
        error: (err: HttpErrorResponse) => {
          this.sharedService.openSnackbarMessage('QR code has expired, you can no longer lend this item.')
        }
      })
    }
  }

  /** Helper function for `_afterLendDeviceScanned()`. Handling any conflicts might occur after retrieving the device's infos.
   * Possible conflicts like device is already lent by another person, user scans their own items, etc.
   */
  private _handlingErrorAfterScanningDevice(scannedDeviceData: DeviceQRData) {
    /** 
     * Normally this case will only happen if page already provided 'deviceInfo'.
     * If page provides 'deviceInfo', that means user has selected a specific item to scan.
     * 
     * Otherwise if user scan from 'scan' button, 'deviceInfo' will always match the scanned data,
     * since we use the scanned data to get the device info.
     */
    if (this.deviceInfo.id !== scannedDeviceData.id) {
      this._handleDeviceMismatch(scannedDeviceData)
      return
    }

    /** If item is not borrowed, call _lendDevice() to proceed to lend item (Final step). */
    if (!this.deviceInfo.borrowed_by_user_id) {
      this._lendDevice()
    } else if (this.deviceInfo.borrowed_by_user_id == this.userService.testUserId) {
      /** If user tries to scan their own item, notify them */
      this.sharedService.openSnackbarMessage(`"${scannedDeviceData.deviceType} (${scannedDeviceData.deviceVariant})" already existed in "Your Items".`, 5000)
    } else {
      /** Else, meaning the device is not available to lend. */
      this.sharedService.openSnackbarMessage(`Scanned item is currently not available or is being lent by another person.`, 5000)
    }
  }

  /** Helper function handling device mismatch:
   * This function is called when user selected a specific item to scan, but scanned the wrong item.
   * This will trigger the alert dialog to ask user whether they want to lend the scanned item anyway.
   */
  private async _handleDeviceMismatch(scannedDeviceData: DeviceQRData): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Item mismatch',
      message: `Scanned item does not match your selected item. Do you still want to lend the scanned item anyway?<br><br>
        Scanned item: ID: ${scannedDeviceData.id} - ${scannedDeviceData.deviceType} (${scannedDeviceData.deviceVariant})<br>
      `,
      cssClass: 'multiline-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return
          }
        },
        {
          text: 'Yes',
          handler: () => {

            this._afterLendDeviceScanned(scannedDeviceData)
          }
        }
      ]
    })
    await alert.present()
  }

  /** Sends request to lend device */
  private _lendDevice() {
    this.loadingService.setLoading(true)
    this.sharedService.lendItem(this.deviceInfo.id).pipe(take(1)).subscribe({
      next: (value: any) => {
        this.loadingService.setLoading(false)
        this.sharedService.openSnackbarMessage(`Successfully added "${this.deviceInfo.item_name}" to your lent items!`)
      },
      error: (err: HttpErrorResponse) => {
        this.loadingService.setLoading(false)
        this.sharedService.openSnackbarMessage('Error lending scanned item, please try again later.')
      }
    })
  }


  scanReturnItem(deviceInfo: Device) {
    this.scan().then( (scanResults: Barcode | undefined) => {
      /** As per 'scan()' function above, scan results will be undefined if permission not granted,
       * or there are issues with the scanner. Hence, handle them here by returning a meaningful error message
       * and exit the function early.
       */
      if (!scanResults) {
        this.sharedService.openSnackbarMessage('Oops! There seems to be something wrong with the scanner, Please try again later.')
        return
      }


      /** Scan results raw value is in string format, hence we must parse them into JSON */
      const scanResultsJsonValue = JSON.parse(scanResults.rawValue)

      if (this.isValidRoomData(scanResultsJsonValue)) {
        this._returnDevice(deviceInfo, scanResultsJsonValue)
      } else {
        this.sharedService.openSnackbarMessage(`QR code not valid. Are you sure you scanned the Room's QR code?`)
      }
      
    })
  }

  private _afterReturnItemScanned(deviceInfo: Device, scannedResults: RoomQRData) {

  }

  private _returnDevice(device: Device, scannedRoomData: RoomQRData) {
    this.loadingService.setLoading(true)
    this.sharedService.returnItem(device.id, scannedRoomData.id).pipe(take(1)).subscribe({
      next: (value: any) => {
        this.loadingService.setLoading(false)
        this.sharedService.openSnackbarMessage(`Item "${device.item_name}" has been returned at "${scannedRoomData.room_number}"`)
      },
      error: (err: HttpErrorResponse) => {
        this.loadingService.setLoading(false)
      }
    })
  }


  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }


}
