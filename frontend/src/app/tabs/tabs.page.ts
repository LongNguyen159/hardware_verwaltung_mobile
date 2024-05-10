import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, addOutline, homeOutline, qrCode, home, add, hardwareChip, hardwareChipOutline, laptop, laptopOutline, person, personCircle, personCircleOutline, grid, gridOutline, barcode, barcodeOutline, addCircle, addCircleOutline, qrCodeOutline } from 'ionicons/icons';
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
    { tab: 'dashboard', icon: 'home-outline', iconFilled: 'home', route: '/dashboard' },
    { tab: 'qr-code', icon: 'qr-code-outline', route: '/qr-code' },
    { tab: 'user', icon: 'person-circle-outline', iconFilled: 'person-circle', route: '/dashboard' },
  ];

  public environmentInjector = inject(EnvironmentInjector);

  constructor(private router: Router) {
    super()
    addIcons({ triangle, ellipse, addOutline, homeOutline, qrCode, qrCodeOutline, home, add,
      laptop, laptopOutline, personCircle, personCircleOutline,
      grid, gridOutline, barcode, barcodeOutline, addCircle, addCircleOutline
     })
  }

  ngOnInit(): void {
    this.setSelectedTab(this.router.url)

    this.router.events.pipe(takeUntil(this.componentDestroyed$)).subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setSelectedTab(event.url)
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
