import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Barcode, BarcodeFormat, BarcodeScanner, ScanOptions } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Device, DeviceQRData } from 'src/app/shared/models/shared-models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

/** TODO:
 * Move logics from qr code page to service. In the future there might be 
 * many components that uses this scanner service.
 */
export class QrCodeService {
  sharedService = inject(SharedService)
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
   * storing/clearing them.
   * 
   * NOTE: It is recommended to check for the interface returned by the scanner.
   * Using the funciton  `isValidDeviceData(jsonValue)` below, we can check whether if
   * the data scanned is a valid 'device' QR code.
   * 
   * Please return a meaningful message or some type of notification for user
   * to let them know if QR code is not valid
   */
  async scan(): Promise<Barcode | undefined> {
    /** Reset storage on every scan */
    this.qrCode = []

    /** Early exit function if permission not granted */
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return
    }

    /** Scanning QR */
    const scanOptions: ScanOptions = {
      formats: [BarcodeFormat.QrCode]
    }
    const { barcodes } = await BarcodeScanner.scan(scanOptions)
    /** Push ensures that the last one will be the most recent */
    this.qrCode.push(...barcodes)
    /** Return the most recent scan result */
    return this.qrCode[this.qrCode.length -1]
  }


  /** Check if scanned data is of type DeviceQRData
   * by checking if all properties match and of correct type
   */
  isValidDeviceData(jsonValue: any): jsonValue is DeviceQRData {
    return (
      typeof jsonValue === 'object' &&
      'id' in jsonValue && typeof jsonValue.id === 'number' &&
      'deviceType' in jsonValue && typeof jsonValue.deviceType === 'string' &&
      'deviceVariant' in jsonValue && typeof jsonValue.deviceVariant === 'string'
    )
  }


  /** Serve the purpose of specifically scan to lend items.
   * Simply call this function and the device is scanned!
   */
  scanLendDevice() {
    this.scan().then( (scanResults: Barcode | undefined) => {
      if (!scanResults) {
        return
      }

      const jsonValue = JSON.parse(scanResults.rawValue)
      if (this.isValidDeviceData(jsonValue)) {
        this._afterLendDeviceScanned(jsonValue)
      } else {
        this.sharedService.openSnackbarMessage('QR code not valid.')
      }
      
    })
  }

  private _afterLendDeviceScanned(scannedDeviceData: DeviceQRData) {
    this.sharedService.getItemById(scannedDeviceData.id).pipe(take(1)).subscribe({
      next: (value: Device) => {
        this.deviceInfo = value

        /** If item is not borrowed, call _lendDevice() to POST/PATCH lend item */
        if (!this.deviceInfo.borrowed_by_user_id) {
          this._lendDevice()
        } else if (this.deviceInfo.borrowed_by_user_id == this.sharedService.testUserId) {
          /** If user tries to scan their own item, notify them */
          this.sharedService.openSnackbarMessage('You already lent this device.')
        } else {
          /** Else, meaning the device is not available to lend. */
          this.sharedService.openSnackbarMessage('This device is currently not available.')
        }
        
      },

      /** Error getting item by id means the device is deleted from database,
       * or the requested ID does not exist. Either way, device is not available to lend.
       */
      error: (err: HttpErrorResponse) => {
        this.sharedService.openSnackbarMessage('QR code has expired, you can no longer lend this device.')
      }
    })
  }

  private _lendDevice() {
    this.sharedService.lendItem(this.deviceInfo.id).pipe(take(1)).subscribe({
      next: (value: any) => {
        this.sharedService.openSnackbarMessage(`Successfully added "${this.deviceInfo.item_name}" to your lent items!`)
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.openSnackbarMessage('Error lending this item, please try again later.')
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
