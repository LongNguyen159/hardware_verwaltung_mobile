import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { OverviewPageComponent } from './feature/device_management/pages/overview-page/overview-page.component';
import { DeviceDetailsComponent } from './feature/device_management/pages/device-details/device-details.component';
import { RoomPageComponent } from './feature/room_management/pages/room-page/room-page.component';
import { RoomDetailsPageComponent } from './feature/room_management/pages/room-details/room-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/device', pathMatch: 'full' },
  { path: 'device/:id', component: DeviceDetailsComponent},
  { path: 'device', component: OverviewPageComponent},
  { path: 'room', component: RoomPageComponent},
  { path: 'room/:id', component: RoomDetailsPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
