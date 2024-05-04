import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, AlertController, IonList, IonItem, IonLabel, IonInput, IonToast } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { addIcons } from 'ionicons';
import { chevronForward, scan } from 'ionicons/icons';
import { QrCodeService } from '../service/qr-code.service';
import { RouterModule } from '@angular/router';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { CommonModule } from '@angular/common';
import { Device, DeviceQRData } from 'src/app/shared/models/shared-models';
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
  sharedService =  inject(SharedService)
  qrCodeService = inject(QrCodeService)

  isSupported = false

  /******** Scanning device section ********/
  lastScannedDevice: DeviceQRData
  totalScannedDevice: DeviceQRData[] = []

  deviceInfo: Device
  lentDevices: Device[] = []
  
  isScannedDeviceValid: boolean = false
  /******** End scanning device section ********/


  returnQrCodeData: Barcode[] = []

  constructor(
    private alertController: AlertController
  ) {
    addIcons({scan, chevronForward})
    this.checkIfPlatformSupportsQrScan()
  }


  checkIfPlatformSupportsQrScan() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported
    })
  }

  /** User scans to lend item */
  scanLendItem() {

    
    this.qrCodeService.scan().then( (scanResult: Barcode | undefined) => {
      if (scanResult) {
        const jsonValue = JSON.parse(scanResult.rawValue)

        /** Check if scanned value is of type DeviceQRData. */
        this.isScannedDeviceValid = this.qrCodeService.isValidDeviceData(jsonValue)

        if (this.isScannedDeviceValid) {
          this._afterScannedDevice(jsonValue)
        } else {
          this.sharedService.openSnackbarMessage('QR code not valid')
        }
      }
    })
  }

  private _afterScannedDevice(scannedDeviceData: DeviceQRData) {
    this.lastScannedDevice = scannedDeviceData
    this.totalScannedDevice.push(this.lastScannedDevice)


    this.sharedService.getItemById(this.lastScannedDevice.id).pipe(take(1)).subscribe({
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


  /** User scans to return item */
  // async scanReturnItem(): Promise<void> {
  //   const granted = await this.requestPermissions()
  //   if (!granted) {
  //     this.presentAlert()
  //     return;
  //   }
  //   const { barcodes } = await BarcodeScanner.scan();
  //   this.returnQrCodeData.push(...barcodes);
  //   console.log( 'return qr data:' , this.returnQrCodeData)

  //   /** Scan Room's QR to return. We will get id of room as info.
  //    * IDEA:
  //    * Take deviceId as an arry of number, then use forkJoin to make multiple POST request (return multiple devices)
  //    * call service to send POST request:
  //    * for each id inside deviceIds, POST:
  //    * {
  //    *  item_id: id (each id of deviceIds),
  //    *  room_id: 1 (stays the same),
  //    *  item_hisotry_type: 2 (return),
  //    *  user_id: 123 (stays the same)
  //    *  ...
  //    * }
  //    */
  // }
}
