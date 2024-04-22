import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RoutesRecognized } from '@angular/router';
import {
  IonBackButton,
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
import { DeviceMetaData, ImageResponse } from 'src/app/shared/models/shared-models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NavController } from '@ionic/angular';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { filter, pairwise } from 'rxjs/operators';
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
    CommonModule
  ],
})

export class DeviceDetailsPageComponent extends BaseComponent implements OnInit {
  deviceDetails: DeviceMetaData
  deviceId: number

  editedNotes: string = ''
  imageToShow: string
  isPortrait: boolean = false
  unixTimestampMiliseconds: number

  lastModifiedDate: Date
  timezoneName: string
  relativeTime: string

  backButtonLabel: string = 'Back'
  @Input()
  set id(deviceId: string) {
    const id = parseInt(deviceId)
    if (id) {
      this.getDeviceInfos(id)
    }
  }


  constructor(
    private sharedService: SharedService,
    public platformService: PlatformService,
  ) { 
    super()
  }

  ngOnInit() {
  }

  getDeviceInfos(deviceId: number) {
    this.sharedService.getItemById(deviceId).pipe(takeUntil(this.componentDestroyed$)).subscribe(device => {
      this.deviceDetails = device
      this.deviceId = device.id
      /** Retrive image from database to show */
      this.getSavedImage()
      this.retrieveNotes()
    })
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
