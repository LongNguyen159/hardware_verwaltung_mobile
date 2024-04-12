import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, addOutline, homeOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
export interface TabEntry {
  tab: string
  icon: string
  label: string
  route: string
}
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, CommonModule],
})
export class TabsPage {

  tabEntries: TabEntry[] = [
    { tab: 'device', icon: 'home-outline', label: 'Device', route: '/device' },
    { tab: 'tab1', icon: 'triangle', label: 'Tab 1', route: '/tabs/tab1' },
    { tab: 'tab2', icon: 'ellipse', label: 'Tab 2', route: '/tabs/tab2' },
    { tab: 'tab3', icon: 'add-outline', label: 'Tab 3', route: '/tabs/tab3' }
  ]

  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ triangle, ellipse, addOutline, homeOutline });
  }
}
