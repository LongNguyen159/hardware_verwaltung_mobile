import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { addIcons } from 'ionicons';
import { chevronForward, scan } from 'ionicons/icons';
import { QrCodeService } from '../service/qr-code.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-qr-code',
  templateUrl: 'qr-code.page.html',
  styleUrls: ['qr-code.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, TitleBarComponent,
    IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    RouterModule
  ]
})
export class QrCodeScanner {

  constructor(public qrCodeService: QrCodeService) {
    addIcons({scan, chevronForward})
  }

  scan() {
    this.qrCodeService.scan()
  }

}
