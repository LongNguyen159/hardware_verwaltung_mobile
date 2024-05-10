import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSkeletonText, IonList, IonItem, IonInfiniteScroll, IonLabel, IonAlert, IonInfiniteScrollContent, IonLoading, IonButton, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { map, take, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { TitleBarComponent } from 'src/app/shared/components/title-bar/title-bar.component';
import { Device } from 'src/app/shared/models/shared-models';
import { ColorModeService } from 'src/app/shared/services/color-mode.service';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { Keyboard } from '@capacitor/keyboard';
import { LoadingService } from 'src/app/shared/services/loading.service';

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

  allAvailableDevicesFiltered: Device[] = []

  colorMode: string

  @ViewChild('content') content: IonContent;
  constructor(public platformService: PlatformService,
    private colorModeService: ColorModeService
  ) {
    super()
  }

  ngOnInit() {
    this.getAllDevices()


    this.colorModeService.getUserUiMode().pipe(takeUntil(this.componentDestroyed$)).subscribe(mode => {
      console.log('System mode:', mode)
      this.colorMode = mode
    })


    /** Init all devices */
    this.sharedService.getAllItems().pipe(take(1)).subscribe(allItems => {
      const allAvailableItems = allItems.filter(item => !item.borrowed_by_user_id)
      this.allAvailableDevicesFiltered = [...allAvailableItems]
    })
  }

  getAllDevices() {
    this.sharedService.getAllItems().pipe(takeUntil(this.componentDestroyed$)).subscribe(allItems => {
      const allAvailableItems = allItems.filter(item => !item.borrowed_by_user_id)
      this.allAvailableDevices = [...allAvailableItems]
    })
  }

  /** Track item by its id to keep track of them on the list. (Mainly to preserve scroll position upon update datasource) */
  trackById(index: number, item: any): number {
    return item.id
  }

  onSearchDevices(input: string | null | undefined) {
    const searchTerm = input?.trim().toLowerCase(); // Convert input to lowercase and remove leading/trailing whitespace
    if (!searchTerm) {
      this.allAvailableDevicesFiltered = [...this.allAvailableDevices]
    } else {
      const filteredDevices = this.allAvailableDevices.filter(device =>
          device.item_name.toLowerCase().includes(searchTerm) ||
          device.description.toLowerCase().includes(searchTerm) ||
          device.location.toLowerCase().includes(searchTerm)
      )
      this.allAvailableDevicesFiltered = [...filteredDevices]
    }
  }

  onContentScroll() {
    if (this.platformService.isNativePlatform()) {
      Keyboard.hide()
    }
  }

  
}
