import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrScanPageComponent } from './qr-scan.page';

const routes: Routes = [
  {
    path: '',
    component: QrScanPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrScanPageRoutingModule {}
