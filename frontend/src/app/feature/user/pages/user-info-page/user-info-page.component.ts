import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonAvatar } from '@ionic/angular/standalone';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
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

  constructor() { 
    super()
  }

  ngOnInit() {


  }

}
