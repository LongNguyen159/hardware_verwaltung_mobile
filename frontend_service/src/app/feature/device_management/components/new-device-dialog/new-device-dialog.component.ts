import { Component, Inject, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatStepper } from '@angular/material/stepper';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
@Component({
  selector: 'app-new-device-dialog',
  templateUrl: './new-device-dialog.component.html',
  styleUrls: ['./new-device-dialog.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class NewDeviceDialogComponent {
  @ViewChild('stepper') stepper: MatStepper;

  deviceName: string = '';
  deviceLocation: string = '';

  firstFormGroup: FormGroup

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.firstFormGroup = this._formBuilder.group({
      deviceName: ['', Validators.required],
      deviceLocation: ['', Validators.required]
    });
  }



  createNewDevice(): void {
    // Emit the input values when the "Confirm" button is clicked
    this.dialogRef.close({ deviceName: this.firstFormGroup.value.deviceName, deviceLocation: this.firstFormGroup.value.deviceLocation });
  }

  getErrorMessage(): string {
    const deviceNameControl = this.firstFormGroup.get('deviceName');
    const locationControl = this.firstFormGroup.get('deviceLocation');

    if (deviceNameControl?.hasError('required')) {
      return 'Device Name is required';
    }

    if (locationControl?.hasError('required')) {
      return 'Location is required';
    }

    // If both inputs are filled, return an empty string
    return '';
  }
}
