import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, AlertController, IonList, IonItem, IonLabel, IonInput, IonToast, IonBadge } from '@ionic/angular/standalone';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { addIcons } from 'ionicons';
import { albums, albumsOutline, chevronForward, qrCode, scan } from 'ionicons/icons';
import { QrCodeService } from '../service/qr-code.service';
import { RouterModule } from '@angular/router';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { CommonModule } from '@angular/common';
import { Device, DeviceQRData } from 'src/app/shared/models/shared-models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { take, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: 'qr-code.page.html',
  styleUrls: ['qr-code.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, TitleBarComponent,
    IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    RouterModule, IonList, IonItem, IonLabel, IonInput, CommonModule,
    IonToast, IonBadge
  ]
})
export class QrCodeScanner extends BaseComponent implements OnInit {
  qrCodeService = inject(QrCodeService)
  userService = inject(UserService)

  isSupported = false

  /******** Scanning device section ********/
  lastScannedDevice: DeviceQRData
  totalScannedDevice: DeviceQRData[] = []

  deviceInfo: Device
  lentDevices: Device[] = []
  
  isScannedDeviceValid: boolean = false
  /******** End scanning device section ********/


  returnQrCodeData: Barcode[] = []

  yourItemsLength = 0

  constructor(
    private alertController: AlertController
  ) {
    super()
    addIcons({scan, chevronForward, qrCode, albumsOutline, albums})
    this.checkIfPlatformSupportsQrScan()
  }

  ngOnInit(): void {
    this.getYourItemsLength()
  }


  async checkIfPlatformSupportsQrScan() {
    this.isSupported = await this.qrCodeService.isCodeScannerSupported()
  }

  /** User scans to lend item */
  scanLendItem() {
    this.qrCodeService.scanLendDevice()
  }

  getYourItemsLength() {
    this.sharedService.getItemsBorrowedByUserId(this.userService.testUserId).pipe(takeUntil(this.componentDestroyed$)).subscribe( allItems => {
      this.yourItemsLength = allItems.length
    })
  }
}
