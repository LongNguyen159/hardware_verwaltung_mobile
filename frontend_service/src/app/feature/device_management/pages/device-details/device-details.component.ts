import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceMetaData, DeviceMetaData1, QrData } from '../../models/device-models';
import { generateQRCodeFromJSON } from '../../utils/utils';
import { DeviceService } from '../../service/device.service';
import { saveAs } from 'file-saver';
import { Subject, take, takeUntil } from 'rxjs';
@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})

export class DeviceDetailsComponent implements OnInit, OnDestroy {
  deviceId: number
  qrCodeDataUrl: string
  deviceDetailsMock: DeviceMetaData = { id: 1, deviceName: 'ElectroTech M1', location: 'Location 1', inLage: 'Yes', duration: '2 hours' }
  deviceDetails: DeviceMetaData1
  
  destroyed$ = new Subject<void>()

  constructor(private route: ActivatedRoute, private deviceService: DeviceService) {}
  ngOnInit(): void {
    /** Retrieve Device ID from URL */
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.deviceId = parseInt(id)

      this.deviceService.getItemById(this.deviceId).pipe(takeUntil(this.destroyed$)).subscribe((device: DeviceMetaData1) => {
        this.deviceDetails = device

        /** GET Device details by id here; then pass data in to generate qr of that device */
        const QrData: QrData = {
          id: this.deviceId,
          deviceName: this.deviceDetails.product_type.name /** devive name acquired from api */
        }

        generateQRCodeFromJSON(this.deviceService, QrData).then(data => {
          this.qrCodeDataUrl = data
        })
      })
    }
  }


  downloadQRCode() {
    // Check if qrCodeDataUrl is not available
    if (!this.qrCodeDataUrl) {
        console.error('QR code data URL is not available.')
        return
    }

    // Extract the data from the data URL
    const base64Image = this.qrCodeDataUrl.split(';base64,').pop()

    // Check if base64Image is not available
    if (!base64Image) {
        console.error('QR code data URL is invalid.')
        return
    }
    // Create a Blob object from the base64 data
    const blob = new Blob([this.base64ToArrayBuffer(base64Image)], { type: 'image/png' });

    // Use FileSaver.js to trigger the download
    saveAs(blob, `${this.deviceDetailsMock.id}_${this.deviceDetails.product_type.name.replace(/\s+/g, '_')}.png`)
  }

  base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  ngOnDestroy(): void {
    this.destroyed$.next()
    this.destroyed$.complete()
  }

}
