import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonAvatar, IonButton, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { take, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { User } from 'src/app/shared/models/shared-models';
import { ColorModeService } from 'src/app/shared/services/color-mode.service';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-info-page',
  templateUrl: './user-info-page.component.html',
  styleUrls: ['./user-info-page.component.scss'],
  standalone: true,
  imports: [IonCardContent, 
    IonIcon,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    CommonModule,
    IonAvatar,
    IonButton,
    IonCard
  ]
})
export class UserInfoPageComponent extends BaseComponent implements OnInit {
  platformService = inject(PlatformService)
  userService = inject(UserService)
  colorModeService = inject(ColorModeService)

  userId: number
  user: User
  colorTheme: string = ''

  constructor() { 
    super()
  }

  ngOnInit() {
    this.userId = this.userService.testUserId

    this.getUserInfos()

    /** Get color theme mode: dark or light. This is for the inverted image place holder of the avatar */
    this.getColorMode()
  }

  getColorMode() {
    this.colorModeService.getUserUiMode().pipe(takeUntil(this.componentDestroyed$)).subscribe( (theme: string) => {
      this.colorTheme = theme
    })
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
