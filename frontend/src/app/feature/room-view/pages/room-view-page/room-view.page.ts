import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonLabel, IonItem } from '@ionic/angular/standalone';
import { TitleBarComponent } from '../../../../shared/components/title-bar/title-bar.component';
import { RouterModule } from '@angular/router';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { take, takeUntil } from 'rxjs';
import { Device, Room } from 'src/app/shared/models/shared-models';
import { CommonModule } from '@angular/common';
import { PlatformService } from 'src/app/shared/services/platform.service';

@Component({
  selector: 'app-room-view',
  templateUrl: 'room-view.page.html',
  styleUrls: ['room-view.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, TitleBarComponent,
    IonButtons, IonBackButton, IonList, IonTitle, IonLabel, IonItem, RouterModule,
    CommonModule
  ],
})
export class RoomOverviewPageComponent extends BaseComponent implements OnInit {
  allRooms: Room[] = []
  roomId: number
  roomDetails: Room

  allItems: Device[] = []
  allItemsOfRoom: Device[] = []
  availableItems: Device[] = []


  constructor(
    public platformService: PlatformService
  ) {
    super()
  }

  ngOnInit(): void {
    this.getAllRooms()
    this.getAllItems()
  }

  getAllRooms() {
    this.sharedService.getAllRooms().pipe(takeUntil(this.componentDestroyed$)).subscribe(
      (rooms: Room[]) => {
        this.allRooms = rooms
      }
    )
  }

  getAllItems() {
    this.sharedService.getAllItems().pipe(takeUntil(this.componentDestroyed$)).subscribe(allItems => {
      this.allItems = allItems
    })
  }

  getAvailableItemsCountForRoom(roomId: number): string {
    const room = this.allRooms.find(room => room.id === roomId)
    if (room) {
      const itemsOfRoom = this.allItems.filter(item => item.location === room.room_number)
      const availableItems = itemsOfRoom.filter(item => !item.borrowed_by_user_id)
      if (availableItems.length == 0) {
        return 'No available item'
      }
      if (availableItems.length == 1) {
        return '1 available item'
      }
      return `${availableItems.length} available items`
    } else {
      return `-`
    }
  }
}
