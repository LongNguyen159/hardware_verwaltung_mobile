import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import { RoomInterface } from 'src/app/feature/device_management/models/device-models';
import { DeviceService } from 'src/app/feature/device_management/service/device.service';
import { BasePageComponent } from 'src/app/shared/components/base-page/base-page.component';
import { NewRoomDialogComponent } from '../../components/new-room-dialog/new-room-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from 'src/app/shared/service/shared.service';
import { AlertDialogComponent, DialogData } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

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

  constructor(private deviceService: DeviceService, private router: Router, public dialog: MatDialog, private sharedService: SharedService) {
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

  updateTableDataSrc() {
    this.deviceService.getAllRooms().pipe(take(1)).subscribe(rooms => {
      this.roomDataSource.data = rooms
      this.roomDataSource.sort = this.sort
      this.roomDataSource.paginator = this.paginator
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.roomDataSource.filter = filterValue.trim().toLowerCase()
  }

  navigateToDetailsPage(roomId: number) {
    this.router.navigate(['/room', roomId])
  }

  openNewRoomDialog() {
    const dialogRef = this.dialog.open(NewRoomDialogComponent, {
      width: '40vw',
    })

    dialogRef.afterClosed().subscribe(result => {
      // send POST request here
      if (result) {
        this.deviceService.createNewRoom(result).pipe(take(1)).subscribe({
          next: (res) => {
            this.sharedService.openSnackbar('New room created successfully!')
            this.updateTableDataSrc()
          },
          error: (err: HttpErrorResponse) => {
            this.sharedService.openSnackbar('Error creating new room, please try again.')
          }
        })
      }
    })
  }

  /** NOTE: This would remove all items associated with that room */
  onDeleteRoom(event: Event, roomId: number) {
    event.stopPropagation()
    const dialogData: DialogData = {
      title: 'Are you sure you want to delete this room?',
      message: `Room ID ${roomId} will be permanently removed. QR code and all associated data will no longer be valid. This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      confirmButtonColor: 'warn'
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '40vw',
      data: dialogData
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.deleteRoom(roomId).pipe(take(1)).subscribe({
          next: (res) => {
            this.updateTableDataSrc()
            this.sharedService.openSnackbar('Room has been successfully removed!')
          },
          error: (err: HttpErrorResponse) => {
            this.updateTableDataSrc()
            this.sharedService.openSnackbar(`Error deleting room: ${err.error.details}`)
          }
        })
      } else {
        return
      }
    })

    
  }
}
