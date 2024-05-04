import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PlatformService } from '../../services/platform.service';
@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    CommonModule,
    IonContent,
    
  ]
})
export class TitleBarComponent {
  @Input() title: string = ''
  @Input() enableBackButton: boolean = false
  @Input() backLocation: string

  constructor(public platformService: PlatformService) {}
}
