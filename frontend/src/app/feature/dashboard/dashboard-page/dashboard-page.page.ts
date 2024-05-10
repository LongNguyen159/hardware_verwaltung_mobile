import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, IonButtons, IonButton, IonItem, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { albums, chevronForward, desktop, desktopOutline, laptop, laptopOutline, locationOutline, moon, moonOutline, sunny, sunnyOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { take, takeUntil } from 'rxjs';
import { User } from 'src/app/shared/models/shared-models';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard-page.page.html',
  styleUrls: ['dashboard-page.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, TitleBarComponent, 
    IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, RouterModule, IonIcon,
    CommonModule,
    IonBadge
  ],
})
export class DashboardPageComponent extends BaseComponent implements OnInit, OnDestroy { 
  userService = inject(UserService)
  greetingText: string = ''
  iconName: string = ''
  iconColor: string = ''
  username: string = 'User'
  isIOS: boolean

  yourItemsLength = 0
  private intervalId: any
  constructor(private platformService: PlatformService) {
    super()
    this.isIOS = this.platformService.isIOSPlatform()


    addIcons({chevronForward, albums, locationOutline, laptop, laptopOutline, desktop, desktopOutline,
      sunnyOutline, sunny, moon, moonOutline
    })
  }

  ngOnInit(): void {
    this.getGreetingsText()
    this.getUsername()
    this.intervalId = setInterval(() => {
      this.getGreetingsText() // Call the function every hour
    }, 3600000) // 3600000 milliseconds = 1 hour

    this.getItemsByUser()
  }

  getUsername() {
    this.sharedService.getUserById(this.userService.testUserId).pipe(take(1)).subscribe({
      next: (value: User) => {
        this.username = `${value.first_name} ${value.last_name}`
      },
      error: (err: HttpErrorResponse) => {

      }
    })
  }

  getGreetingsText() {
    const currentHour = new Date().getHours()
    if (currentHour >= 5 && currentHour < 12) {
      this.greetingText = "Good morning"

      
      this.iconName = 'sunny'
      this.iconColor = '#e2c111'
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greetingText = "Good afternoon"


      this.iconName = 'sunny'
      this.iconColor = '#e2c111'
    } else {
      this.greetingText = "Good evening"

      this.iconName = 'moon'
      this.iconColor = 'rgb(92, 94, 222)'
    }
  }

  getItemsByUser() {
    this.sharedService.getItemsBorrowedByUserId(this.userService.testUserId).pipe(takeUntil(this.componentDestroyed$)).subscribe(items => {
      this.yourItemsLength = items.length
    })
  }

  // @ts-ignore
  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
