import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, IonButtons, IonButton, IonItem, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../../explore-container/explore-container.component';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
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

  private intervalId: any
  constructor() {
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
