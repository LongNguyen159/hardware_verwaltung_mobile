import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
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
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/dashboard',
    pathMatch: 'full',
  },
]