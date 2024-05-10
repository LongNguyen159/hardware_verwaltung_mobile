import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RoutesRecognized } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { take, takeUntil } from 'rxjs';
import { TitleBarComponent } from 'src/app/shared/components/title-bar/title-bar.component';
import { Device, ImageResponse, User } from 'src/app/shared/models/shared-models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NavController } from '@ionic/angular';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { filter, pairwise } from 'rxjs/operators';
import { QrCodeService } from 'src/app/feature/qr-code/service/qr-code.service';
import { Barcode } from '@capacitor-mlkit/barcode-scanning';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UserService } from 'src/app/shared/services/user.service';
@Component({
  selector: 'app-device-details-page',
  templateUrl: './device-details-page.component.html',
  styleUrls: ['./device-details-page.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonLabel,
    IonButtons,
    IonBackButton,
    IonItem,
    DatePipe,
    TitleBarComponent,
    RouterModule,
    CommonModule,
    IonButton
  ],
})

export class DeviceDetailsPageComponent extends BaseComponent implements OnInit {
  qrCodeService = inject(QrCodeService)
  loadingService = inject(LoadingService)
  userService = inject(UserService)
  isCodeScannerSupported: boolean = false

  deviceDetails: Device
  deviceId: number

  userInfos: User

  editedNotes: string = ''

  /** Image metadata */
  imageToShow: string
  isPortrait: boolean = false
  unixTimestampMiliseconds: number

  /** Image last modified since */
  lastModifiedDate: Date
  timezoneName: string
  relativeTime: string

  backButtonLabel: string = 'Back'

  /** Boolean flag to determine whether or not the device belongs to current user */
  isItemByUser: boolean = false


  @Input()
  set id(deviceId: string) {
    const id = parseInt(deviceId)
    if (id) {
      this.getDeviceInfos(id)
    }
  }


  constructor(
    public platformService: PlatformService,
  ) { 
    super()
  }

  ngOnInit() {
  }

  /** Get device infos upon page init via the id params in router */
  getDeviceInfos(deviceId: number) {
    this.sharedService.getItemById(deviceId).pipe(takeUntil(this.componentDestroyed$)).subscribe(device => {
      this.deviceDetails = device
      this.deviceId = device.id
      /** Retrive image from database to show */
      this.getSavedImage()
      this.retrieveNotes()

      /** Get user info after device info is retrieved */
      this.getUserInfo()
    })
  }

  /** Get user info to associate relation between item and user */
  getUserInfo() {
    this.sharedService.getUserById(this.userService.testUserId).pipe(takeUntil(this.componentDestroyed$)).subscribe(user => {
      this.userInfos = user
    })
  }

  async onLendItemClick() {
    /** Check if platform supports code scanning first. If yes, open code scanner camera */
    this.isCodeScannerSupported = await this.qrCodeService.isCodeScannerSupported()

    if (!this.isCodeScannerSupported) {
      this.sharedService.openSnackbarMessage('Lending an item requires QR-Code scanning functionality. Your platform does not support this feature.', 7000)
      return
    }

    this.qrCodeService.scanLendDevice(this.deviceDetails)
  }



  async onReturnItemClick() {
    this.isCodeScannerSupported = await this.qrCodeService.isCodeScannerSupported()

    if (!this.isCodeScannerSupported) {
      this.sharedService.openSnackbarMessage('Lending an item requires QR-Code scanning functionality. Your platform does not support this feature.', 7000)
      return
    }

    this.qrCodeService.scanReturnItem(this.deviceDetails)
  }


  retrieveNotes() {
    this.sharedService.getItemById(this.deviceId).pipe(take(1)).subscribe(device => {
      device.annotation ? this.editedNotes = device.annotation : this.editedNotes = ''
    })
  }

  /** Get saved image and display them (if there is an image) */
  getSavedImage() {
    this.sharedService.getImageOfDevice(this.deviceId).pipe(takeUntil(this.componentDestroyed$)).subscribe(blobData => {
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
    this.sharedService.getImageInfos(this.deviceId).pipe(take(1)).subscribe((imageData: ImageResponse[]) => {
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
    }, 3 * 60 * 1000); // Update every 3 minutes
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

}
