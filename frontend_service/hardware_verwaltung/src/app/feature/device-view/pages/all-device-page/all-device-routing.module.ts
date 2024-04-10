import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDevicePageComponent } from './all-device.page';

const routes: Routes = [
  {
    path: '',
    component: AllDevicePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
