import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DeviceOverviewPageComponent } from './feature/device_management/pages/device-overview-page/device-overview-page.component';
import { OverviewPageComponent } from './feature/overview/pages/overview-page/overview-page.component';

const routes: Routes = [
  { path: 'device-overview', component: DeviceOverviewPageComponent},
  { path: 'overview', component: OverviewPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
