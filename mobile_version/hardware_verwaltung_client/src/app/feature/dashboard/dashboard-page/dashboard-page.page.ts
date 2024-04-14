import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, IonButtons, IonButton, IonItem, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard-page.page.html',
  styleUrls: ['dashboard-page.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, TitleBarComponent, 
    IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, RouterModule, IonIcon,
    CommonModule
  ],
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  greetingText: string = ''
  username: string = 'Long Nguyen'
  isIOS: boolean
  private intervalId: any
  constructor(public platform: Platform) {
    this.isIOS = this.platform.is('ipad') || this.platform.is('iphone') || this.platform.is('ios');
    console.log(this.isIOS)
    addIcons({chevronForward})
  }

  ngOnInit(): void {
    this.getGreetingsText()
    this.intervalId = setInterval(() => {
      this.getGreetingsText() // Call the function every hour
    }, 3600000) // 3600000 milliseconds = 1 hour
  }

  getGreetingsText() {
    const currentHour = new Date().getHours()
    if (currentHour >= 5 && currentHour < 12) {
      this.greetingText = "Good morning"
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greetingText = "Good afternoon"
    } else {
      this.greetingText = "Good evening"
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
