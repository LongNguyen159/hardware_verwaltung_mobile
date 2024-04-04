import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { OverviewPageComponent } from './feature/device_management/pages/overview-page/overview-page.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { NewDeviceDialogComponent } from './feature/device_management/components/new-device-dialog/new-device-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DeviceDetailsComponent } from './feature/device_management/pages/device-details/device-details.component';
import {MatCardModule} from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeviceService } from './feature/device_management/service/device.service';
import { HttpClientModule } from '@angular/common/http';
import { BasePageComponent } from './shared/components/base-page/base-page.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RoomPageComponent } from './feature/room_management/pages/room-page/room-page.component';
import { TitleBarComponent } from './shared/components/title-bar/title-bar.component';
import { RoomDetailsPageComponent } from './feature/room_management/pages/room-details/room-details.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NewRoomDialogComponent } from './feature/room_management/components/new-room-dialog/new-room-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    OverviewPageComponent,
    NewDeviceDialogComponent,
    DeviceDetailsComponent,
    BasePageComponent,
    RoomPageComponent,
    TitleBarComponent,
    RoomDetailsPageComponent,
    NewRoomDialogComponent
  ],
  imports: [
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatTooltipModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatDialogModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [DeviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
