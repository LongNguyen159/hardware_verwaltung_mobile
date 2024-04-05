import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceMetaData, DownloadFileName, deviceQrData } from '../../models/device-models';
import { downloadQRCode, generateQRCodeFromJSON } from '../../utils/utils';
import { DeviceService } from '../../service/device.service';
import { saveAs } from 'file-saver';
import { Subject, take, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/shared/service/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
/**
 * TODO:
 * Feat: Allow user to upload photos of device in this page.
 */
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  deviceId: number
  qrCodeDataUrl: string
  deviceDetails: DeviceMetaData

  editedNotes: string = ''
  
  destroyed$ = new Subject<void>()

  constructor(private route: ActivatedRoute, private deviceService: DeviceService, private sharedService: SharedService) {}
  ngOnInit(): void {
    /** Retrieve Device ID from URL */
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.deviceId = parseInt(id)
      this.retrieveNotes()


      this.deviceService.getItemById(this.deviceId).pipe(takeUntil(this.destroyed$)).subscribe((device: DeviceMetaData) => {
        this.deviceDetails = device
        /** GET Device details by id here; then pass data in to generate qr of that device */
        const QrData: deviceQrData = {
          id: this.deviceId,
          deviceType: this.deviceDetails.item_name, /** devive name acquired from api */
          deviceVariant: this.deviceDetails.description
        }

        generateQRCodeFromJSON(QrData).then(data => {
          this.qrCodeDataUrl = data
        })
      })
    }
  }

  retrieveNotes() {
    this.deviceService.getItemById(this.deviceId).pipe(take(1)).subscribe(device => {
      device.annotation ? this.editedNotes = device.annotation : this.editedNotes = ''
    })
  }

  onNotesReset() {
    this.retrieveNotes()
    this.sharedService.openSnackbar('Notes reset successfully!')
  }

  saveNotes() {
    this.deviceService.updateItemNotes(this.deviceId, this.editedNotes).pipe(take(1)).subscribe({
      next: (res) => {
        this.sharedService.openSnackbar('Notes updated successfully!')
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.openSnackbar(`Error updating notes: ${err.error.details}`)
      }
    })
  }

  onDownloadClick() {
    const downloadFileName: DownloadFileName = {
      id: this.deviceDetails.id,
      name: this.deviceDetails.item_name
    }
    downloadQRCode(this.qrCodeDataUrl, downloadFileName)
  }

  

  ngOnDestroy(): void {
    this.destroyed$.next()
    this.destroyed$.complete()
  }

}
