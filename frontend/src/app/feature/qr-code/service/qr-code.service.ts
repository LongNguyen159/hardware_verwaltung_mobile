import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Barcode, BarcodeFormat, BarcodeScanner, ScanOptions } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { DeviceQRData } from 'src/app/shared/models/shared-models';

@Injectable({
  providedIn: 'root'
})

/** TODO:
 * Move logics from qr code page to service. In the future there might be 
 * many components that uses this scanner service.
 */
export class QrCodeService {
  qrCode: Barcode[] = []


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
