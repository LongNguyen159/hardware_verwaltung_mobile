import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonContent, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar, IonFab, IonItemSliding, IonItemOptions, IonItemOption, IonCheckbox, CheckboxChangeEventDetail, CheckboxCustomEvent, IonFooter } from '@ionic/angular/standalone';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { RouterModule } from '@angular/router';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Subject, take, takeUntil } from 'rxjs';
import { Device, User } from 'src/app/shared/models/shared-models';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/user.service';
import { addIcons } from 'ionicons';
import { checkmarkCircle, checkmarkCircleOutline, create, createOutline, menu, pencil, qrCode } from 'ionicons/icons';
import { QrCodeService } from '../qr-code/service/qr-code.service';

@Component({
  selector: 'app-your-items',
  templateUrl: './your-items.page.html',
  styleUrls: ['./your-items.page.scss'],
  standalone: true,
  imports: [IonFab, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    RouterModule, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonButton,
    IonIcon, IonFabButton,
    IonItemSliding, IonItemOptions, IonItemOption, IonCheckbox,
    IonFooter
  ]
})

/** TODO:
 * After implementing login, we can get the user ID and pass into 'getItemsBorrowedByUser()'.
 * For testing purposes, we will hard code a user ID here.
 */
export class YourItemsPage extends BaseComponent implements OnInit {
  userService = inject(UserService)
  qrCodeService = inject(QrCodeService)
  userId: number
  user: User

  isSelectMode: boolean = false
  /** Selected items */
  selectedItems: Device[] = []

  /** All items list */
  itemsByUser: Device[] = []

  constructor(
    public platformService: PlatformService
  ) { 
    super()

    addIcons({qrCode, menu, createOutline, create, pencil, checkmarkCircleOutline})
  }

  ngOnInit() {
    this.getUserInfos()

    this.sharedService.getSelectedDevices().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (value: Device[]) => {
        this.selectedItems = value
      }
    })
  }

  /** Get user Infos here, as user has logged in. */
  getUserInfos() {
    this.userId = this.userService.testUserId

    this.sharedService.getUserById(this.userId).pipe(take(1)).subscribe({
      next: (value: User) => {
        this.user = value
        this.getItemsBorrowedByUser()
      },
      error: (err: HttpErrorResponse) => {
        
      }
    })
  }

  onLendClick() {
    this.qrCodeService.scanLendDevice()
  }

  onReturnClick(deviceInfo: Device | Device[]) {
    this.qrCodeService.scanReturnDevice(deviceInfo)
  }

  getItemsBorrowedByUser() {
    this.sharedService.getItemsBorrowedByUserId(this.userId).pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (value: Device[]) => {
        this.itemsByUser = value
      },
      error: (err: HttpErrorResponse) => {
        console.error(err)
      }
    })
  }

  toggleSelectItems() {
    this.isSelectMode = !this.isSelectMode
  }

  onDoneClick() {
    /** Reset selected items on 'done' click. This is equivalent to clicking 'cancel' */
    this.sharedService.clearSelectedDevices()
  }

  onItemsSelect(option: CheckboxCustomEvent) {
    this.sharedService.setSelectedDevices(option)
  }

}
