import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';

@Component({
  selector: 'app-qr-code',
  templateUrl: 'qr-code.page.html',
  styleUrls: ['qr-code.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, TitleBarComponent]
})
export class QrCodeScanner {

  constructor() {}

}
