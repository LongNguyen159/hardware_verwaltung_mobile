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

  selectedFile: File
  imageToShow: any
  isPortrait: boolean = false

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

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement

    /** User confirms file select */
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0]
      console.log('selected:', this.selectedFile.name)
      this.displaySelectedImage()
      this.onSubmit()

      /** Later logic:
       * Call onSubmit() => Send post/patch request to backend to save image to database.
       * After onSubmit(): inside onSubmit(), call displaySelectedImage().
       * 
       * displaySelectedImage(): send GET request to retrieve photo url.
       */
    } else {
      console.error('No file selected.')
    }
  }

  /** GET data from server */
  displaySelectedImage() {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.imageToShow = event.target?.result;
      // Check if the image is in portrait orientation
      const img = new Image();
      img.src = this.imageToShow;
      img.onload = () => {
        this.isPortrait = img.height > img.width
      };
    };
    reader.readAsDataURL(this.selectedFile)
  }

  /** Send request to Backend to delete the image from database */
  clearPhoto() {
    this.imageToShow = null
  }

  /** Later implement POST data to server/database */
  onSubmit() {
    const formData = new FormData()
    formData.append('image', this.selectedFile, this.selectedFile.name)
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
