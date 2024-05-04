import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { RouterModule } from '@angular/router';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-your-items',
  templateUrl: './your-items.page.html',
  styleUrls: ['./your-items.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    RouterModule, IonButtons, IonBackButton, IonList, IonItem, IonLabel
  ]
})

/** TODO:
 * After implementing login, we can get the user ID and pass into 'getItemsBorrowedByUser()'.
 * For testing purposes, we will hard code a user ID here.
 */
export class YourItemsPage extends BaseComponent implements OnInit {

  userId: number

  constructor(
    public platformService: PlatformService
  ) { 
    super()
  }

  ngOnInit() {
    this.getUserInfos()

  }

  /** Get user Infos here, as user has logged in. */
  getUserInfos() {
    this.userId = this.sharedService.testUserId
  }

  getItemsBorrowedByUser() {
  }

}
