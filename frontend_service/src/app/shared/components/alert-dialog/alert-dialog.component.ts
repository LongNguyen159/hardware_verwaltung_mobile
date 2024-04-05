import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string
  message?: string
  confirmLabel: string
  cancelLabel: string
  confirmButtonColor?: string
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(false)
  }

  onConfirmClick(): void {
    this.dialogRef.close(true)
  }
}
