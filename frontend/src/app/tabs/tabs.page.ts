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
    this._highlightActiveTab(this.router.url)
  }

  private _listenToRouterChanges() {
    this.router.events.pipe(takeUntil(this.componentDestroyed$)).subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this._highlightActiveTab(event.url)
      }
    })
  }

  private _highlightActiveTab(url: string) {
    const parts = url.split('/')
      const tabName = parts[parts.length - 1]
      this.tabNameExtractFromUrl = tabName
      this.selectedTab = tabName  
  }

  async onQrClick() {
    const isSupported = await this.qrCodeService.isCodeScannerSupported()
    if (!isSupported) {
      this.sharedService.openSnackbarMessage('QR code scanning is not supported on this platform')
      this.selectedTab = this.tabNameExtractFromUrl
      return
    }
    
    this.qrCodeService.scanLendDevice()
  }
}
