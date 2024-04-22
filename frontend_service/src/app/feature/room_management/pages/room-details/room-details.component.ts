import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import { DeviceMetaData, DownloadFileName, RoomInterface } from 'src/app/feature/device_management/models/device-models';
import { DeviceService } from 'src/app/feature/device_management/service/device.service';
import { downloadQRCode, generateQRCodeFromJSON } from 'src/app/feature/device_management/utils/utils';
import { BasePageComponent } from 'src/app/shared/components/base-page/base-page.component';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss']
})
export class RoomDetailsPageComponent extends BasePageComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator
  roomId: number
  roomDetails: RoomInterface
  displayedColumns: string[] = ['item_name', 'description']
  qrCodeDataUrl: string

  allItemsOfRoom: DeviceMetaData[] = []
  allItemsNotBorrowed: DeviceMetaData[] = []
  dataSource: MatTableDataSource<DeviceMetaData>

  roomName: string = ''
  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute,
  ) {
    super()
  }

  ngOnInit(): void {
    /** Get ID param from URL */
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.roomId = parseInt(id)
      this.getRoomDetails(this.roomId)
    }
  }

  getAllItems() {
    this.deviceService.getAllItems().pipe(takeUntil(this.componentDestroyed$)).subscribe(allItems => {
      this.allItemsOfRoom = allItems.filter(item => item.location === this.roomDetails.room_number)
      this.allItemsNotBorrowed = this.allItemsOfRoom.filter(item => !item.borrowed_by_user_id)

      this.dataSource = new MatTableDataSource(this.allItemsOfRoom)
    })
  }


  getRoomDetails(id: number) {
    this.deviceService.getOneRoom(id).pipe(take(1)).subscribe((room: RoomInterface) => {
      this.roomDetails = room
      this.roomName = room.room_number
      /** Get all items of that room */
      this.getAllItems()

      generateQRCodeFromJSON(room).then(data => {
        this.qrCodeDataUrl = data
      })
    })
  }


  onDownloadClick() {
    const downloadFileName: DownloadFileName = {
      id: this.roomId,
      name: this.roomDetails.room_number
    }
    downloadQRCode(this.qrCodeDataUrl, downloadFileName)
  }
}
