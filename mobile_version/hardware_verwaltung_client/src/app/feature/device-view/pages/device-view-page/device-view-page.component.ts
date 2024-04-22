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
 * fix: polling reset list to beginning, very annoying.
 * feat: implement filtering function
 * fix: filtering and polling conflict: after polling, filter does not apply anymore
 * => Approach: Compare objects and merge.
 * Compare incoming array of json, see if any changes: UPDATE, INSERT, DELETE => update only that item.
 * UPDATE: length or value of object has changed.
 * INSERT: length of whole array has increased, or item_id of incoming does not exist
 * DELETE: length of whole array has decreased, or item_id of current not found in incoming.
 * 
 * optimise further: instead of polling every 10s, only update and merge if there are changes in the database.
 * => Approach: use query notification. Every time database chagnes anything, notify frontend.
 * If want to make it scalable, consider batching: not every change should be notified, but changes in batch:
 * meaning, after a batch of changes, notify frontend.
 * 
 * If 1000 user changes something and we notify frontend each time, frontend will compare and merge data 1000 times,
 * which is inefficient.
 * 
 * 
 * feat: login page
 */
export class DeviceViewPageComponent extends BaseComponent implements OnInit {
  allAvailableDevices: DeviceMetaData[] = []

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

  onSearchFocus() {
    /** Show accessory bar on keyboard */
    if ( this.platformService.isNativePlatform()) {
      Keyboard.setAccessoryBarVisible({ isVisible: true })
    }
  }

  async hideAccessoryBarOnKeyboard() {
    if (this.platformService.isNativePlatform()) {
      Keyboard.setAccessoryBarVisible({ isVisible: false })
    }
  }

  onContentScroll() {
    if (this.platformService.isNativePlatform()) {
      Keyboard.hide()
    }
  }

  
}
