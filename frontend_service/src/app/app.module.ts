import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { DeviceOverviewPageComponent } from './feature/device_management/pages/device-overview-page/device-overview-page.component';
import { OverviewPageComponent } from './feature/overview/pages/overview-page/overview-page.component';
import {MatTableModule} from '@angular/material/table';
@NgModule({
  declarations: [
    AppComponent,
    DeviceOverviewPageComponent,
    OverviewPageComponent
  ],
  imports: [
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
