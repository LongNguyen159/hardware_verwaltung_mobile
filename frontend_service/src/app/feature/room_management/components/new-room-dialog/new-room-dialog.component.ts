import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-new-room-dialog',
  templateUrl: './new-room-dialog.component.html',
  styleUrls: ['./new-room-dialog.component.scss']
})
export class NewRoomDialogComponent {
  inputValue: string = ''

  constructor(public dialogRef: MatDialogRef<NewRoomDialogComponent>, private snackBar: MatSnackBar, private sharedService: SharedService) {}

  onCancel(): void {
    this.dialogRef.close(undefined)
  }

  onConfirm(): void {
    // Check if inputValue is empty or contains only whitespace
    if (!this.inputValue.trim()) {
      this.sharedService.openSnackbar('Room number cannot be empty')
      return // Exit the function without closing the dialog
    }

    // Check if inputValue contains only special characters
    const specialCharactersRegex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
    if (specialCharactersRegex.test(this.inputValue)) {
      this.sharedService.openSnackbar('Input value contains only special characters.')
      return // Exit the function without closing the dialog
    }


    this.dialogRef.close(this.inputValue)
  }
}
