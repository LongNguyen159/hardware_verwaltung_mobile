import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../../shared/components/title-bar/title-bar.component';

@Component({
  selector: 'app-room-view',
  templateUrl: 'room-view.page.html',
  styleUrls: ['room-view.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, TitleBarComponent],
})
export class RoomOverviewPageComponent {
  constructor() {}
}
