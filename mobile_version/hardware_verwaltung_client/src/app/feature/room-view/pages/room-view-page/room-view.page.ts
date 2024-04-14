import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonLabel, IonItem } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../../shared/components/title-bar/title-bar.component';
import { RouterModule } from '@angular/router';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { take, takeUntil } from 'rxjs';
import { DeviceMetaData, RoomInterface } from 'src/app/shared/models/shared-models';
import { CommonModule } from '@angular/common';
import { PlatformService } from 'src/app/shared/services/platform.service';

@Component({
  selector: 'app-room-view',
  templateUrl: 'room-view.page.html',
  styleUrls: ['room-view.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, TitleBarComponent,
    IonButtons, IonBackButton, IonList, IonTitle, IonLabel, IonItem, RouterModule,
    CommonModule
  ],
})
export class RoomOverviewPageComponent extends BaseComponent implements OnInit {
  allRooms: RoomInterface[] = []
  roomId: number
  roomDetails: RoomInterface

  allItems: DeviceMetaData[] = []
  allItemsOfRoom: DeviceMetaData[] = []
  availableItems: DeviceMetaData[] = []


  constructor(
    private sharedService: SharedService,
    public platformService: PlatformService
  ) {
    super()
  }

  ngOnInit(): void {
    this.getAllRoomsData()
    this.getAvailableItemsCount()
  }

  getAllRoomsData() {
    this.sharedService.getAllRooms().pipe(takeUntil(this.componentDestroyed$)).subscribe(
      (rooms: RoomInterface[]) => {
        this.allRooms = rooms
      }
    )
  }

  getAvailableItemsCount() {
    this.sharedService.getAllItems().pipe(takeUntil(this.componentDestroyed$)).subscribe(allItems => {
      /** Get items of specific room */
      this.allItems = allItems      
      // this.allItemsOfRoom = allItems.filter(item => item.location === this.roomDetails.room_number)
      /** Filter out which items has not been borrowed => hence 'available items' */
      // this.availableItems = this.allItemsOfRoom.filter(item => !item.borrowed_by_user_id)
    })
  }

  getAvailableItemsCountForRoom(roomId: number): number {
    const room = this.allRooms.find(room => room.id === roomId)
    if (room) {
      const itemsOfRoom = this.allItems.filter(item => item.location === room.room_number);
      const availableItems = itemsOfRoom.filter(item => !item.borrowed_by_user_id);
      return availableItems.length
    } else {
      return 0
    }
  }


  getRoomDetails(id: number) {
    this.sharedService.getOneRoom(id).pipe(take(1)).subscribe((room: RoomInterface) => {
      this.roomDetails = room

      /** Get all items of that room */
      this.getAvailableItemsCount()
    })
  }
}
