import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

/** TODO:
 * Move logics from qr code page to service. In the future there might be 
 * many components that uses this scanner service.
 */
export class QrCodeService {
  isSupported = false
  qrCode: Barcode[] = []

  constructor(private alertController: AlertController) { 
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported
    })
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.qrCode.push(...barcodes);
    console.log(this.qrCode)
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
