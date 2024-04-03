import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { RoomInterface } from 'src/app/feature/device_management/models/device-models';
import { DeviceService } from 'src/app/feature/device_management/service/device.service';
import { BasePageComponent } from 'src/app/shared/components/base-page/base-page.component';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent extends BasePageComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  displayedColumns = ['id', 'room_number']

  columnMap: { [key: string]: string } = {
    'id': 'ID',
    'room_number': 'Room Name'
  }

  roomDataSource: MatTableDataSource<RoomInterface>

  constructor(private deviceService: DeviceService) {
    super()
  }

  ngOnInit(): void {
    this.getAllRoomsData()
  }


  getAllRoomsData() {
    this.deviceService.getAllRooms().pipe(takeUntil(this.componentDestroyed$)).subscribe(
      (rooms: RoomInterface[]) => {
        
        this.roomDataSource = new MatTableDataSource<RoomInterface>(rooms)
        this.roomDataSource.sort = this.sort
        this.roomDataSource.paginator = this.paginator
      }
    )
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.roomDataSource.filter = filterValue.trim().toLowerCase()
  }

  
}
