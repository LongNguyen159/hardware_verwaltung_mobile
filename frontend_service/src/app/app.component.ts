import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'verwaltung_hardware';
  constructor(private router: Router) {
    /** Navigate to overview as default */
    // this.router.navigate(['/overview'])
  }
}
