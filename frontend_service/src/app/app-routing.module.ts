import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { OverviewPageComponent } from './feature/device_management/pages/overview-page/overview-page.component';
import { DeviceDetailsComponent } from './feature/device_management/pages/device-details/device-details.component';

const routes: Routes = [
  { path: 'device-details', component: DeviceDetailsComponent},
  { path: 'overview', component: OverviewPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
