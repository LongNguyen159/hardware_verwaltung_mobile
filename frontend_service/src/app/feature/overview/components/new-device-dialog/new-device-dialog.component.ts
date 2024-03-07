import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-new-device-dialog',
  templateUrl: './new-device-dialog.component.html',
  styleUrls: ['./new-device-dialog.component.scss']
})
export class NewDeviceDialogComponent {
  constructor(
    public diaLogRef: MatDialogRef<NewDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
