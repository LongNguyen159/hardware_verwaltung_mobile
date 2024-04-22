import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, AlertController, IonList, IonItem, IonLabel, IonInput, IonToast } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { addIcons } from 'ionicons';
import { chevronForward, scan } from 'ionicons/icons';
import { QrCodeService } from '../service/qr-code.service';
import { RouterModule } from '@angular/router';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { CommonModule } from '@angular/common';
import { DeviceMetaData, deviceQrData } from 'src/app/shared/models/shared-models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-qr-code',
  templateUrl: 'qr-code.page.html',
  styleUrls: ['qr-code.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, TitleBarComponent,
    IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    RouterModule, IonList, IonItem, IonLabel, IonInput, CommonModule,
    IonToast
  ]
})
export class QrCodeScanner {

  isSupported = false

  lendQrCodeData: Barcode[] = []

  returnQrCodeData: Barcode[] = []

  constructor(private alertController: AlertController,
    private sharedService: SharedService
  ) { 
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported
    })
    addIcons({scan, chevronForward})
  }

  /** User scans to lend item */
  async scanLendItem(): Promise<void> {
    const granted = await this.requestPermissions()
    if (!granted) {
      this.presentAlert()
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    console.log( 'lend qr data:', this.lendQrCodeData)
    this.lendQrCodeData.push(...barcodes);
    const deviceScanResult: deviceQrData = JSON.parse(this.lendQrCodeData[this.lendQrCodeData.length - 1].rawValue)
    this.sharedService.getItemById(deviceScanResult.id).pipe(take(1)).subscribe({
      next: (value: DeviceMetaData) => {
        this.sharedService.openSnackbarMessage('Device lent successfully!')
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.openSnackbarMessage('QR code has expired, you can no longer lend this device.')
      }
    })




    /** After getting JSON from the QR code, first send GET request to get item's full info.
     * call sharedService.getItemById(id)
     * 
     * After getting full infos, send POST request to item-history, patch borrowed by user
     * Close scanner.
     */
  }

  testClick() {
    this.sharedService.openSnackbarMessage('Device lent successfully!')
  }


  /** User scans to return item */
  async scanReturnItem(): Promise<void> {
    const granted = await this.requestPermissions()
    if (!granted) {
      this.presentAlert()
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.returnQrCodeData.push(...barcodes);
    console.log( 'return qr data:' , this.returnQrCodeData)

    /** Scan Room's QR to return. We will get id of room as info.
     * IDEA:
     * Take deviceId as an arry of number, then use forkJoin to make multiple POST request (return multiple devices)
     * call service to send POST request:
     * for each id inside deviceIds, POST:
     * {
     *  item_id: id (each id of deviceIds),
     *  room_id: 1 (stays the same),
     *  item_hisotry_type: 2 (return),
     *  user_id: 123 (stays the same)
     *  ...
     * }
     */
  }



  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the QR scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

}
