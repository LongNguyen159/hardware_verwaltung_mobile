import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { take } from 'rxjs';
import { TitleBarComponent } from 'src/app/shared/components/title-bar/title-bar.component';
import { DeviceMetaData } from 'src/app/shared/models/shared-models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-device-details-page',
  templateUrl: './device-details-page.component.html',
  styleUrls: ['./device-details-page.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonLabel,
    IonButtons,
    IonBackButton,
    IonItem,
    DatePipe,
    TitleBarComponent,
    RouterModule
  ],
})
export class DeviceDetailsPageComponent  implements OnInit {
  deviceDetails: DeviceMetaData

  @Input()
  set id(deviceId: string) {
    this.sharedService.getItemById(parseInt(deviceId)).pipe(take(1)).subscribe(device => {
      this.deviceDetails = device
    })
  }


  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    console.log(window.history);
  }

}
