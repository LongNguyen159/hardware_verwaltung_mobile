import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, addOutline, homeOutline, qrCode, home, add, hardwareChip, hardwareChipOutline, laptop, laptopOutline, person, personCircle, personCircleOutline, grid, gridOutline, barcode, barcodeOutline, addCircle, addCircleOutline, qrCodeOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../shared/components/base/base.component';
import { QrCodeService } from '../feature/qr-code/service/qr-code.service';
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
  qrCodeService = inject(QrCodeService)

  selectedTab: string = ''
  tabNameExtractFromUrl = ''

  timeOutId: any

  public environmentInjector = inject(EnvironmentInjector);

  constructor(private router: Router) {
    super()

    
    addIcons({ triangle, ellipse, addOutline, homeOutline, qrCode, qrCodeOutline, home, add,
      laptop, laptopOutline, personCircle, personCircleOutline,
      grid, gridOutline, barcode, barcodeOutline, addCircle, addCircleOutline
    })

    /** Subscribe to url changes */
    this._listenToRouterChanges()
  }

  ngOnInit(): void {
    /** Highlight the active tab by the link on init */
    this._highlightActiveTab(this.router.url)
  }

  /** Event triggered every time router changes the link (navigating). */
  private _listenToRouterChanges() {
    this.router.events.pipe(takeUntil(this.componentDestroyed$)).subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this._highlightActiveTab(event.url)
      }
    })
  }
  /** Extract the router url and assign the highlighted tab accordingly */
  private _highlightActiveTab(url: string) {
    const parts = url.split('/')
    const tabName = parts[parts.length - 1]
    this.tabNameExtractFromUrl = tabName
    this.selectedTab = tabName
  }
  /** Event triggered on tab button touch, there is a touch timeout.
   * If touch and holding for too long, the touch will be reset.
   * The touch tab will be set again to the url (active tab)
   */
  onTabButtonsTouch(tabName: string) {
    const touchTimeout = 700
    /** Assign selected tab to be the touched tab. After timeout, reset the selected tab
     * to be the current active tab. (determined by url)
     */
    this.selectedTab = tabName

    /** Clear timeout before starting a timeout to avoid duplicate timers */
    if (this.timeOutId) {
      clearTimeout(this.timeOutId)
    }

    // Set a timeout to reset the highlightedTab after the specified duration
    this.timeOutId = setTimeout(() => {
      this.selectedTab = this.tabNameExtractFromUrl
    }, touchTimeout)
  }

  /** Assign selected tab to be the active tab, determined by the url */
  onTabButtonsClick() {
    this.selectedTab = this.tabNameExtractFromUrl
  }

  onQrClick() {
    this.qrCodeService.scanLendDevice()
  }
}
