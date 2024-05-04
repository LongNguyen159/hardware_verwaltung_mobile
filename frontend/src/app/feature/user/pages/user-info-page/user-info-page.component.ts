import { Component, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-info-page',
  templateUrl: './user-info-page.component.html',
  styleUrls: ['./user-info-page.component.scss'],
  standalone: true,
  imports: [
    IonIcon
  ]
})
export class UserInfoPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
