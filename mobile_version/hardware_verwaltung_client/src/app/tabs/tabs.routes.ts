import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      // {
      //   path: 'room',
      //   loadComponent: () =>
      //     import('../feature/room-view/pages/room-view-page/room-view.page').then((m) => m.RoomOverviewPageComponent),
      // },
      {
        path: 'qr-code',
        loadComponent: () =>
          import('../feature/qr-code/qr-code-scanner/qr-code.page').then((m) => m.QrCodeScanner),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../feature/dashboard/dashboard-page/dashboard-page.page').then((m) => m.DashboardPageComponent),
      },
      // {
      //   path: 'device',
      //   loadComponent: () =>
      //     import('../feature/device-view/pages/device-view-page/device-view-page.component').then((m) => m.DeviceViewPageComponent),
      // },
      {
        path: '',
        redirectTo: 'tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/dashboard',
    pathMatch: 'full',
  },
];
