import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { take } from 'rxjs';
import { TitleBarComponent } from 'src/app/shared/components/title-bar/title-bar.component';
import { DeviceMetaData } from 'src/app/shared/models/shared-models';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-device-view-page',
  templateUrl: './device-view-page.component.html',
  styleUrls: ['./device-view-page.component.scss'],
  standalone: true,
  imports: [IonHeader, TitleBarComponent],
})
export class DeviceViewPageComponent  implements OnInit {
  allDevices: DeviceMetaData[] = []
  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.getAllItems().pipe(take(1)).subscribe(allItems => {
      this.allDevices = allItems
      console.log(allItems)
    })
  }

}
