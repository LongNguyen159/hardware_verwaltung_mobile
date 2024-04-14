import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, AlertController, IonList, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { addIcons } from 'ionicons';
import { chevronForward, scan } from 'ionicons/icons';
import { QrCodeService } from '../service/qr-code.service';
import { RouterModule } from '@angular/router';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qr-code',
  templateUrl: 'qr-code.page.html',
  styleUrls: ['qr-code.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, TitleBarComponent,
    IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    RouterModule, IonList, IonItem, IonLabel, IonInput, CommonModule
  ]
})
export class QrCodeScanner {

  isSupported = false
  qrCode: Barcode[] = []

  constructor(private alertController: AlertController) { 
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported
    })
    addIcons({scan, chevronForward})
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions()
    if (!granted) {
      this.presentAlert()
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
