import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { take, takeUntil } from 'rxjs';
import { Device, Room } from 'src/app/shared/models/shared-models';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { fileTray, fileTrayOutline } from 'ionicons/icons';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.page.html',
  styleUrls: ['./room-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButtons, IonBackButton, IonList, IonItem, IonLabel,
    RouterModule, IonIcon
  ]
})
export class RoomDetailsPage extends BaseComponent implements OnInit {
  roomDetails: Room
  allItemsOfRoom: Device[] = []
  availableItems: Device[] = []
  roomName: string = ''
  @Input()
  set id(deviceId: string) {
    const id = parseInt(deviceId)
    if (id) {
      this.getRoomDetails(id)
    }
  }
  constructor(public platformService: PlatformService) { 
    super()
    addIcons({fileTray, fileTrayOutline})
  }

  ngOnInit() {
  }

  getRoomDetails(id: number) {
    this.sharedService.getOneRoom(id).pipe(take(1)).subscribe((room: Room) => {
      this.roomDetails = room
      this.roomName = room.room_number
      /** Get all items of that room */
      this.getAllItems()
    })
  }


  getAllItems() {
    this.sharedService.getAllItems().pipe(takeUntil(this.componentDestroyed$)).subscribe(allItems => {
      this.allItemsOfRoom = allItems.filter(item => item.location === this.roomDetails.room_number)
      
      this.availableItems = this.allItemsOfRoom.filter(item => !item.borrowed_by_user_id)
    })
  }
}
