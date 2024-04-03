import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent {
  @Input() title: string = ''
  @Input() colorBackground: boolean = false
  @Input() enableBackButton: boolean = false

  constructor(
    private router: Router,
    private _location: Location
  ) {}

  onBackButtonClick() {
    this._location.back()
  }
}
