import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceMetaData, DownloadFileName, deviceQrData } from '../../models/device-models';
import { downloadQRCode, generateQRCodeFromJSON } from '../../utils/utils';
import { DeviceService } from '../../service/device.service';
import { saveAs } from 'file-saver';
import { Subject, take, takeUntil } from 'rxjs';
@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
/**
 * TODO:
 * Feat: Allow user to upload photos of device in this page.
 */
export class DeviceDetailsComponent implements OnInit, OnDestroy {
  deviceId: number
  qrCodeDataUrl: string
  deviceDetails: DeviceMetaData
  
  destroyed$ = new Subject<void>()

  constructor(private route: ActivatedRoute, private deviceService: DeviceService) {}
  ngOnInit(): void {
    /** Retrieve Device ID from URL */
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.deviceId = parseInt(id)

      this.deviceService.getItemById(this.deviceId).pipe(takeUntil(this.destroyed$)).subscribe((device: DeviceMetaData) => {
        this.deviceDetails = device

        /** GET Device details by id here; then pass data in to generate qr of that device */
        const QrData: deviceQrData = {
          id: this.deviceId,
          deviceName: this.deviceDetails.item_name /** devive name acquired from api */
        }

        generateQRCodeFromJSON(QrData).then(data => {
          this.qrCodeDataUrl = data
        })
      })
    }
  }

  onDownloadClick() {
    const downloadFileName: DownloadFileName = {
      id: this.deviceDetails.id,
      name: this.deviceDetails.item_name
    }
    downloadQRCode(this.qrCodeDataUrl, downloadFileName)
  }

  

  ngOnDestroy(): void {
    this.destroyed$.next()
    this.destroyed$.complete()
  }

}
