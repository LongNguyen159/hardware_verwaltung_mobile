import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, addOutline, homeOutline, qrCode, home, add } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../shared/components/base/base.component';
export interface TabEntry {
  tab: string
  icon: string
  iconFilled?: string
  label?: string
  route: string
}
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, CommonModule],
})
export class TabsPage extends BaseComponent implements OnInit {
  selectedTab: string = ''

  tabEntries: TabEntry[] = [
    { tab: 'device', icon: 'home-outline', iconFilled: 'home', label: 'Device', route: '/device' },
    { tab: 'room', icon: 'triangle', iconFilled: 'triangle', label: 'Room', route: '/room' },
    { tab: 'qr-code', icon: 'qr-code', iconFilled: 'qr-code', route: '/qr-code' },
    { tab: 'tab3', icon: 'add-outline', iconFilled: 'add', label: 'Tab 3', route: '/tabs/tab3' }
  ];

  public environmentInjector = inject(EnvironmentInjector);

  constructor(private router: Router) {
    super()
    addIcons({ triangle, ellipse, addOutline, homeOutline, qrCode, home, add });
  }

  ngOnInit(): void {
    this.setSelectedTab(this.router.url)

    this.router.events.pipe(takeUntil(this.componentDestroyed$)).subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setSelectedTab(event.url);
      }
    })
  }

  setSelectedTab(url: string) {
    const tab = this.tabEntries.find(entry => url.includes(entry.route));
    if (tab) {
      this.selectedTab = tab.tab;
    }
  }
}
