import { Routes } from '@angular/router';
import { DeviceDetailsPageComponent } from './feature/device-view/pages/device-details-page/device-details-page.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  // {
  //   path: 'details',
  //   loadComponent: () => import('./feature/device-view/pages/device-view-page/device-view-page.component').then((m) => m.DeviceViewPageComponent)
  // },
  {
    path: 'details/:id',
    component: DeviceDetailsPageComponent
  }
];
