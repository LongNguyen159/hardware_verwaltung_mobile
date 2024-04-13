import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'room',
        loadComponent: () =>
          import('../feature/room-view/pages/room-view-page/room-view.page').then((m) => m.RoomOverviewPageComponent),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'device',
        loadComponent: () =>
          import('../feature/device-view/pages/device-view-page/device-view-page.component').then((m) => m.DeviceViewPageComponent),
      },
      {
        path: '',
        redirectTo: 'tabs/device',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/device',
    pathMatch: 'full',
  },
];
