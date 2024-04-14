import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSkeletonText, IonList, IonItem, IonInfiniteScroll, IonLabel, IonAlert, IonInfiniteScrollContent, IonLoading, IonButton, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { take, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { TitleBarComponent } from 'src/app/shared/components/title-bar/title-bar.component';
import { DeviceMetaData } from 'src/app/shared/models/shared-models';
import { ColorModeService } from 'src/app/shared/services/color-mode.service';
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
    IonBackButton,
    IonSearchbar,
  ],
})

/** TODO:
 * fix: polling reset list to beginning, very annoying.
 * feat: implement filtering function
 * fix: filtering and polling conflict: after polling, filter does not apply anymore 
 * 
 * feat: login page
 */
export class DeviceViewPageComponent extends BaseComponent implements OnInit {
  allAvailableDevices: DeviceMetaData[] = []
  searchHidden = false

  colorMode: string

  @ViewChild('content') content: IonContent;
  constructor(private sharedService: SharedService, public platformService: PlatformService,
    private colorModeService: ColorModeService
  ) {
    super()
  }

  ngOnInit() {
    this.sharedService.getAllItems().pipe(takeUntil(this.componentDestroyed$)).subscribe(allItems => {
      this.allAvailableDevices = allItems.filter(item => !item.borrowed_by_user_id)
    })

    this.colorModeService.getUserUiMode().pipe(takeUntil(this.componentDestroyed$)).subscribe(mode => {
      console.log(mode)
      this.colorMode = mode
    })
  }

  onContentScroll(scrollEvent: CustomEvent) {
    console.log(scrollEvent)
    const scrollPosition = scrollEvent.detail.scrollTop;
    this.searchHidden = scrollPosition > 100;
    console.log(this.searchHidden)
  }

}
