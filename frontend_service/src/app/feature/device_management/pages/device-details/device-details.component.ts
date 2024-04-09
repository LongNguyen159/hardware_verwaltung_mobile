import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceMetaData, DownloadFileName, ImageResponse, deviceQrData } from '../../models/device-models';
import { downloadQRCode, generateQRCodeFromJSON } from '../../utils/utils';
import { DeviceService } from '../../service/device.service';
import { saveAs } from 'file-saver';
import { Subject, take, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/shared/service/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BasePageComponent } from 'src/app/shared/components/base-page/base-page.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent, DialogData } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})

export class DeviceDetailsComponent extends BasePageComponent implements OnInit {
  deviceId: number
  qrCodeDataUrl: string
  deviceDetails: DeviceMetaData

  editedNotes: string = ''
  selectedFile: File
  imageToShow: string
  isPortrait: boolean = false
  unixTimestampMiliseconds: number

  lastModifiedDate: Date
  timezoneName: string
  relativeTime: string

  constructor(private route: ActivatedRoute, private deviceService: DeviceService, private sharedService: SharedService, private dialog: MatDialog) {
    super()
  }
  ngOnInit(): void {
    /** Retrieve Device ID from URL */
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.deviceId = parseInt(id)
      /** Get saved notes */
      this.retrieveNotes()

      /** Get saved image, this function will get BLOB data of image and parse it to url for the template to display */
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

  /** being called when user confirms the selected file (when choosing photos) */
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

  /** If confirm selected photo, submit form; send POST request to server. */
  onSubmit() {
    /** Gather selected file metadata to include in POST request */
    const formData = new FormData()
    formData.append('file_name', this.selectedFile.name)
    formData.append('device_id', this.deviceId.toString())
    formData.append('image', this.selectedFile)

    this.deviceService.uploadDeviceImageToServer(formData, this.deviceId).pipe(take(1)).subscribe({
      next: (res: any) => {
        /** After POST get the image url from response and read BLOB data */
        this.deviceService.getImageBlob(res.image).pipe(take(1)).subscribe(imageBlob => {
          this._readBlobDataFromImage(imageBlob)
        })
        /** format date after posting new image */
        this._formatDateTimeFromUnix(res.unix_time)

        this.sharedService.openSnackbar('Image uploaded successfully!')
      },
      error: (err: HttpErrorResponse) => {
        console.error(err)
        if (err.error.image[0]) {
          const dialogData: DialogData = {
            title: 'Error: Cannot upload image to server',
            message: `${err.error.image[0]}`,
            confirmLabel: 'Ok',
            cancelLabel: ''
          }
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            width: '40vw',
            data: dialogData
          })

          dialogRef.afterClosed().subscribe(result => {
            return
          })
        }
        this.sharedService.openSnackbar('Error uploading image to server, please try again later.')
      }
    })
  }

  /** Get saved image and display them (if there is an image) */
  getSavedImage() {
    this.deviceService.getImageOfDevice(this.deviceId).pipe(takeUntil(this.componentDestroyed$)).subscribe(blobData => {
      if (blobData) {
        /** Get image infos (id, name, etc.) */
        this.getSavedImageMetaData()
        this._readBlobDataFromImage(blobData)
      } else {
        /** Display nothing when there are no images found */
        this.imageToShow = ''
      }
    })
  }

  /** Get image infos everytime page reloaded or initialised */
  getSavedImageMetaData() {
    this.deviceService.getImageInfos(this.deviceId).pipe(take(1)).subscribe((imageData: ImageResponse[]) => {
      console.log(imageData)
      this._formatDateTimeFromUnix(imageData[0].unix_time)
    })
  }

  private _formatDateTimeFromUnix(unixSeconds: number) {
    this.unixTimestampMiliseconds = unixSeconds * 1000
    this.lastModifiedDate = new Date(this.unixTimestampMiliseconds)
    const timezoneLong = new Intl.DateTimeFormat('en-US', { timeZoneName: 'long' }).format(this.lastModifiedDate)
    const firstSpaceIndex = timezoneLong.indexOf(' ')

    /** Splice the long time zone to just get the latter part 'Center EU Time' */
    this.timezoneName = timezoneLong.substring(firstSpaceIndex)

    this.relativeTime = this.sharedService.getRelativeTimeText(this.lastModifiedDate)
    /** Update relative time in interval, in case user stays on one page for a long time */
    this.intervalUpdate = setInterval(() => {
      this.relativeTime = this.sharedService.getRelativeTimeText(this.lastModifiedDate)      
    }, 5 * 60 * 1000); // Update every 5 minutes
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
        this.imageToShow = ''
        this.sharedService.openSnackbar('Image cleared!')
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

  onQrDownloadClick() {
    const downloadFileName: DownloadFileName = {
      id: this.deviceDetails.id,
      name: this.deviceDetails.item_name
    }
    downloadQRCode(this.qrCodeDataUrl, downloadFileName)
  }
}
