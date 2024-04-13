import { Routes } from '@angular/router';
import { DeviceDetailsPageComponent } from './feature/device-view/pages/device-details-page/device-details-page.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'device',
    loadComponent: () =>
      import('./feature/device-view/pages/device-view-page/device-view-page.component').then((m) => m.DeviceViewPageComponent),
  },
  {
    path: 'device/:id',
    loadComponent: () =>
      import('./feature/device-view/pages/device-details-page/device-details-page.component').then((m) => m.DeviceDetailsPageComponent),
  },
  {
    path: 'room',
    loadComponent: () =>
      import('./feature/room-view/pages/room-view-page/room-view.page').then((m) => m.RoomOverviewPageComponent),
  },
];
