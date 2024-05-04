import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonAvatar } from '@ionic/angular/standalone';
import { take } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { User } from 'src/app/shared/models/shared-models';
import { PlatformService } from 'src/app/shared/services/platform.service';

@Component({
  selector: 'app-user-info-page',
  templateUrl: './user-info-page.component.html',
  styleUrls: ['./user-info-page.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    CommonModule,
    IonAvatar
  ]
})
export class UserInfoPageComponent extends BaseComponent implements OnInit {
  platformService = inject(PlatformService)

  userId: number

  user: User

  constructor() { 
    super()
  }

  ngOnInit() {
    this.userId = this.sharedService.testUserId

    this.getUserInfos()
  }

  getUserInfos() {
    this.sharedService.getUserById(this.userId).pipe(take(1)).subscribe({
      next: (value: User) => {
        this.user = value
      },
      error: (err: HttpErrorResponse) => {
        console.error(err)
      }
    })
  }

}
