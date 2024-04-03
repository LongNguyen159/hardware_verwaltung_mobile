import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import { DownloadFileName, RoomInterface } from 'src/app/feature/device_management/models/device-models';
import { DeviceService } from 'src/app/feature/device_management/service/device.service';
import { downloadQRCode, generateQRCodeFromJSON } from 'src/app/feature/device_management/utils/utils';
import { BasePageComponent } from 'src/app/shared/components/base-page/base-page.component';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss']
})
export class RoomDetailsPageComponent extends BasePageComponent implements OnInit {
  roomId: number
  roomDetails: RoomInterface

  qrCodeDataUrl: string

  roomName: string = ''
  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute
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


  getRoomDetails(id: number) {
    this.deviceService.getOneRoom(id).pipe(take(1)).subscribe((room: RoomInterface) => {
      this.roomDetails = room
      this.roomName = room.room_number

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
