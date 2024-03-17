import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ProductType } from '../../models/device-models';
import { Observable, Subject, of } from 'rxjs';
import { startWith, map, take, takeUntil } from 'rxjs/operators';
import { DeviceService } from '../../service/device.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-new-device-dialog',
  templateUrl: './new-device-dialog.component.html',
  styleUrls: ['./new-device-dialog.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NewDeviceDialogComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('auto') auto: any;
  @ViewChild('autoDescription') autoDescription: any;

  @ViewChild('productTypeInput') productTypeInput: ElementRef;
  @ViewChild('descriptionInput') descriptionInput: ElementRef;

  /** Filtered as user types => Observable of changes in the form field */
  filteredProductTypes$: Observable<ProductType[]> | null = null
  filteredDescriptions$: Observable<ProductType[]> | null = null

  selectedProductType: ProductType | null = null /** Selected Name - Description pair */
  allItemsOptions: ProductType[] = []

  /** Named 'first form group' because I thought there would be a second form group
   * for the second stepper (dialog), but seems like we don't need the second form group.
   */
  firstFormGroup: FormGroup

  /** Emits when component destroyed, to unsubscribe everything */
  componentDestroyed$ = new Subject<void>()

  /** Boolean flag true when no matching results when filtering in auto complete fields */
  noMatchingProductType: boolean = false
  noMatchingProductDescription: boolean = false

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewDeviceDialogComponent>,
    private deviceService: DeviceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    /** Initialise form */
    this.firstFormGroup = this._formBuilder.group({
      deviceName: ['', Validators.required],
      deviceDescription: [''],
      deviceAnnotation: [''],
      deviceLocation: ['', Validators.required],
    })
  }

  /** TODO: Auto complete for Rooms */
  ngOnInit(): void {
    /** Acquire all product types from API for auto complete suggestions */
    this.deviceService.getAllProductTypes().pipe(take(1)).subscribe(allItems => {
      this.allItemsOptions = allItems
    })

    this.filteredProductTypes$ = this.firstFormGroup.get('deviceName')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value!, this.allItemsOptions))
    )
    
    /** Check matching product type results */
    this.filteredProductTypes$.pipe(takeUntil(this.componentDestroyed$)).subscribe((value: ProductType[]) => {
      if (value.length == 0) {
        this.noMatchingProductType = true
      } else {
        this.noMatchingProductType = false
      }
    })

    this.filteredDescriptions$ = this.firstFormGroup.get('deviceDescription')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDescription(value!, this.allItemsOptions))
    )

    /** Check matching description results */
    this.filteredDescriptions$.pipe(takeUntil(this.componentDestroyed$)).subscribe((value: ProductType[]) => {
      if (value.length == 0) {
        this.noMatchingProductDescription = true
      } else {
        this.noMatchingProductDescription = false
      }
    })
  }

  /** Called when user selects an option in the auto complete field */
  onAutoCompleteSelected(selection: MatAutocompleteSelectedEvent): void {
    this.selectedProductType = selection.option.value;
    selection.option.value = this.selectedProductType

    this.firstFormGroup.patchValue({
      deviceName: this.selectedProductType?.name ?? '',
      deviceDescription: this.selectedProductType?.description ?? '',
    })
    console.log('selected from type field:', this.selectedProductType)
  }

  /** Called as user types. Auto assign the user input if it matches exactly the item
   * but the user don't select it.
   */
  onDeviceTypeInputChange(userInput: string): void {
    const matchingItem = this.allItemsOptions.find(item => item.name.toLowerCase() == userInput.toLowerCase())
    console.log(matchingItem)
    if (matchingItem && !this.noMatchingProductType) {
      this.selectedProductType = matchingItem
    }
  }


  onDescriptionInputChange(userInput: string): void {
    const matchingItem = this.allItemsOptions.find(item => item.description.toLowerCase() == userInput.toLowerCase())
    console.log(matchingItem )
    if (matchingItem && !this.noMatchingProductDescription) {
      this.selectedProductType = matchingItem
    }
  }

  /** Submit form results */
  createNewDevice(): void {
    /** If no matching anything in the database, set id to null
     * to let the database assign new id for it.
     * 
     * If there already exists the item, send the id to the database.
     */
    if (!this.noMatchingProductDescription && !this.noMatchingProductType) {
      this.dialogRef.close({
        product_type: this.selectedProductType,
        annotation: this.firstFormGroup.value.deviceAnnotation,
        current_room: this.firstFormGroup.value.deviceLocation
      })
    } else {
      const newProductType: ProductType = {
        id: null,
        name: this.firstFormGroup.value.deviceName,
        description: this.firstFormGroup.value.deviceDescription,
      }
      
      this.dialogRef.close({
        product_type: newProductType,
        annotation: this.firstFormGroup.value.deviceAnnotation,
        current_room: this.firstFormGroup.value.deviceLocation
      })
    }
  }


  private _filter(value: string | ProductType, options: ProductType[]): ProductType[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()
    return options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterDescription(value: string | ProductType, options: ProductType[]): ProductType[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.description.toLowerCase()
    return options.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  getErrorMessage(): string {
    const deviceNameControl = this.firstFormGroup.get('deviceName');
    const locationControl = this.firstFormGroup.get('deviceLocation');

    if (deviceNameControl?.hasError('required')) {
      return 'Device type is required';
    }

    if (locationControl?.hasError('required')) {
      return 'Location is required';
    }

    /** If both inputs are filled, return an empty string (No error) */
    return ''
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next()
    this.componentDestroyed$.complete()
  }
}
