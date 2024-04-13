import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, IonButtons, IonButton, IonItem, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard-page.page.html',
  styleUrls: ['dashboard-page.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, TitleBarComponent, 
    IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, RouterModule, IonIcon
  ],
})
export class DashboardPageComponent {
  constructor() {
    addIcons({chevronForward})
  }
}
