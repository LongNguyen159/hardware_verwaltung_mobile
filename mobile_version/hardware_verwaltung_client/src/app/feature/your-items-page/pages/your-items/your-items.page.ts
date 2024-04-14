import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-your-items',
  templateUrl: './your-items.page.html',
  styleUrls: ['./your-items.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    RouterModule, IonButtons, IonBackButton, IonList, IonItem, IonLabel
  ]
})
export class YourItemsPage implements OnInit {

  constructor(
    public platformService: PlatformService
  ) { }

  ngOnInit() {
  }

}
