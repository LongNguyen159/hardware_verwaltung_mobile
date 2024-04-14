import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSkeletonText, IonList, IonItem, IonInfiniteScroll, IonLabel, IonAlert, IonInfiniteScrollContent, IonLoading, IonButton, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { take, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { TitleBarComponent } from 'src/app/shared/components/title-bar/title-bar.component';
import { DeviceMetaData } from 'src/app/shared/models/shared-models';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-device-view-page',
  templateUrl: './device-view-page.component.html',
  styleUrls: ['./device-view-page.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonItem,
    IonList,
    IonLoading,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
    IonAlert,
    DatePipe,
    RouterModule,
    TitleBarComponent,
    CommonModule,
    IonButtons,
    IonBackButton
  ],
})
export class DeviceViewPageComponent extends BaseComponent implements OnInit {
  allAvailableDevices: DeviceMetaData[] = []
  constructor(private sharedService: SharedService, public platformService: PlatformService) {
    super()
  }

  ngOnInit() {
    this.sharedService.getAllItems().pipe(takeUntil(this.componentDestroyed$)).subscribe(allItems => {
      this.allAvailableDevices = allItems.filter(item => !item.borrowed_by_user_id)
    })
  }

}
