import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'room',
        loadChildren: () => import('../feature/room-view/pages/room-overview/room-overview.module').then(m => m.RoomOverviewPageModule)
      },
      {
        path: 'qr-scan',
        loadChildren: () => import('../qr-scan/qr-scan.module').then(m => m.QrScanPageModule)
      },
      {
        path: 'device',
        loadChildren: () => import('../feature/device-view/pages/all-device-page/all-device.module').then(m => m.AllDevicePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/device',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/device',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
