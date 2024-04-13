import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
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
    CommonModule
  ]
})
export class TitleBarComponent {
  @Input() title: string = ''
  @Input() enableBackButton: boolean = false
}
