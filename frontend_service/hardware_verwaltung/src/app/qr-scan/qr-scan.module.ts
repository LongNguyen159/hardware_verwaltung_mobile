import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrScanPageComponent } from './qr-scan.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { QrScanPageRoutingModule } from './qr-scan-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    QrScanPageRoutingModule
  ],
  declarations: [QrScanPageComponent]
})
export class QrScanPageModule {}
