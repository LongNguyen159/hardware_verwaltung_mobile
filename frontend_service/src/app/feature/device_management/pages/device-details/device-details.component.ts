import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceMetaData, DownloadFileName, deviceQrData } from '../../models/device-models';
import { downloadQRCode, generateQRCodeFromJSON } from '../../utils/utils';
import { DeviceService } from '../../service/device.service';
import { saveAs } from 'file-saver';
import { Subject, take, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/shared/service/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BasePageComponent } from 'src/app/shared/components/base-page/base-page.component';
@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
/**
 * TODO:
 * Feat: Allow user to upload photos of device in this page.
 * Refactor: Use websocket connection to DB instead of polling.
 */
export class DeviceDetailsComponent extends BasePageComponent implements OnInit {
  deviceId: number
  qrCodeDataUrl: string
  deviceDetails: DeviceMetaData

  editedNotes: string = ''
  selectedFile: File
  imageToShow: any
  isPortrait: boolean = false

  constructor(private route: ActivatedRoute, private deviceService: DeviceService, private sharedService: SharedService) {
    super()
  }
  ngOnInit(): void {
    /** Retrieve Device ID from URL */
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.deviceId = parseInt(id)
      /** Get saved notes */
      this.retrieveNotes()

      /** Get saved image */
      this.getSavedImage()

      /** Get device details */
      this.deviceService.getItemById(this.deviceId).pipe(takeUntil(this.componentDestroyed$)).subscribe((device: DeviceMetaData) => {
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

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement

    /** User confirms file select */
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0]
      this.onSubmit()
    } else {
      console.error('No file selected.')
    }
  }

  /** Later implement POST data to server/database */
  onSubmit() {
    const formData = new FormData()
    formData.append('id', this.selectedFile.lastModified.toString())
    formData.append('file_name', this.selectedFile.name)
    formData.append('device_id', this.deviceId.toString())
    formData.append('image', this.selectedFile)

    this.deviceService.uploadDeviceImageToServer(formData, this.deviceId).pipe(take(1)).subscribe({
      next: (res: any) => {
        /** After POST get the image url from response and read BLOB data */
        this.deviceService.getImageBlob(res.image).pipe(take(1)).subscribe(imageBlob => {
          this._readBlobDataFromImage(imageBlob)
        })
      },
      error: (err: HttpErrorResponse) => {
      }
    })
  }

  getSavedImage() {
    this.deviceService.getImageOfDevice(this.deviceId).pipe(takeUntil(this.componentDestroyed$)).subscribe(blobData => {
      if (blobData) {
        this._readBlobDataFromImage(blobData)
      } else {
        this.imageToShow = null
      }
    })
  }

  private _readBlobDataFromImage(blobData: Blob) {
    const reader = new FileReader()
    reader.onload = () => {
      this.imageToShow = reader.result as string
      const img = new Image()
      img.src = this.imageToShow
      img.onload = () => {
        this.isPortrait = img.height > img.width
      }
    }
    reader.readAsDataURL(blobData)
  }

  clearImage() {
    this.deviceService.clearImage(this.deviceId).pipe(take(1)).subscribe({
      next: (res) => {
        this.imageToShow = null
        this.sharedService.openSnackbar('Photo cleared!')
      },
      error: (err: HttpErrorResponse) => {
        console.error(err)
        this.sharedService.openSnackbar('Error deleting photo')
      }
    })
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
}
