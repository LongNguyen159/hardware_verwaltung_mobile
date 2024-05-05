import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSkeletonText, IonList, IonItem, IonInfiniteScroll, IonLabel, IonAlert, IonInfiniteScrollContent, IonLoading, IonButton, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { take, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { TitleBarComponent } from 'src/app/shared/components/title-bar/title-bar.component';
import { Device } from 'src/app/shared/models/shared-models';
import { ColorModeService } from 'src/app/shared/services/color-mode.service';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { Keyboard } from '@capacitor/keyboard';

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
 * feat: login page
 */
export class DeviceViewPageComponent extends BaseComponent implements OnInit {
  allAvailableDevices: Device[] = []

  colorMode: string

  @ViewChild('content') content: IonContent;
  constructor(public platformService: PlatformService,
    private colorModeService: ColorModeService
  ) {
    super()
  }

  ngOnInit() {
    this.sharedService.getAllItems().pipe(takeUntil(this.componentDestroyed$)).subscribe(allItems => {
      const filteredItems = allItems.filter(item => !item.borrowed_by_user_id)

      /** Slice all items and push in new data.
       * We can assign directly, but that means we loses all tracked items.
       * Doing this will keep the original reference.
       */
      this.allAvailableDevices.splice(0, filteredItems.length)
      this.allAvailableDevices.push(...filteredItems)
    })

    this.colorModeService.getUserUiMode().pipe(takeUntil(this.componentDestroyed$)).subscribe(mode => {
      console.log(mode)
      this.colorMode = mode
    })
  }

  /** Track item by its id to keep track of them on the list. (Mainly to preserve scroll position upon update datasource) */
  trackById(index: number, item: any): number {
    return item.id
  }

  onSearchFocus() {
    /** Show accessory bar on keyboard */
    
  }

  onContentScroll() {
    if (this.platformService.isNativePlatform()) {
      Keyboard.hide()
    }
  }

  
}
