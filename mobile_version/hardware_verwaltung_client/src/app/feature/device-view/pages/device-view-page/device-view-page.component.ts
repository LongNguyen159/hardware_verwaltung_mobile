import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { TitleBarComponent } from 'src/app/shared/components/title-bar/title-bar.component';
@Component({
  selector: 'app-device-view-page',
  templateUrl: './device-view-page.component.html',
  styleUrls: ['./device-view-page.component.scss'],
  standalone: true,
  imports: [IonHeader, TitleBarComponent],
})
export class DeviceViewPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
