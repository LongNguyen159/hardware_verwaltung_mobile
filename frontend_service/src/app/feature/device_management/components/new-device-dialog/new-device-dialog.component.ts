import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NewDeviceData, ProductType, RoomInterface } from '../../models/device-models';
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
  @ViewChild('stepper') stepper: MatStepper
  @ViewChild('auto') auto: any
  @ViewChild('autoDescription') autoDescription: any
  @ViewChild('autoRooom') autoRoom: any

  @ViewChild('productTypeInput') productTypeInput: ElementRef;
  @ViewChild('descriptionInput') descriptionInput: ElementRef;

  /** Filtered as user types => Observable of changes in the form field */
  filteredProductTypes$: Observable<ProductType[]> | null = null
  filteredDescriptions$: Observable<ProductType[]> | null = null
  filteredRooms$: Observable<RoomInterface[]> | null = null

  selectedProductType: ProductType | null = null /** Selected Name - Description pair */
  selectedRoom: RoomInterface | null = null
  allItemsOptions: ProductType[] = []

  allRoomsOptions: RoomInterface[] = []

  /** Named 'first form group' because I thought there would be a second form group
   * for the second stepper (dialog), but seems like we don't need the second form group.
   */
  firstFormGroup: FormGroup

  /** Emits when component destroyed, to unsubscribe everything */
  componentDestroyed$ = new Subject<void>()

  /** Boolean flag true when no matching results when filtering in auto complete fields */
  noMatchingProductType: boolean = false
  noMatchingProductDescription: boolean = false
  noMatchingRoom: boolean = false

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

  ngOnInit(): void {
    /** Acquire all product types from API for auto complete suggestions */
    this.deviceService.getAllProductTypes().pipe(take(1)).subscribe((allItems: ProductType[]) => {
      this.allItemsOptions = allItems
    })

    this.deviceService.getAllRooms().pipe(take(1)).subscribe((rooms: RoomInterface[]) => {
      this.allRoomsOptions = rooms
    })

    this.filteredProductTypes$ = this.firstFormGroup.get('deviceName')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value!, this.allItemsOptions))
    )
    
    /** Check matching product type results
     * This is to prevent false auto assigning
     */
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

    /** Check matching description results
     * This is to prevent false auto assigning
     */
    this.filteredDescriptions$.pipe(takeUntil(this.componentDestroyed$)).subscribe((value: ProductType[]) => {
      if (value.length == 0) {
        this.noMatchingProductDescription = true
      } else {
        this.noMatchingProductDescription = false
      }
    })


    this.filteredRooms$ = this.firstFormGroup.get('deviceLocation')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRoom(value!, this.allRoomsOptions))
    )
  }

  /** Called when user selects an option in the auto complete field */
  onAutoCompleteSelected(selection: MatAutocompleteSelectedEvent): void {
    this.selectedProductType = selection.option.value;
    selection.option.value = this.selectedProductType

    this.firstFormGroup.patchValue({
      deviceName: this.selectedProductType?.name ?? '',
      deviceDescription: this.selectedProductType?.description ?? '',
    })
    console.log('selected from auto complete:', this.selectedProductType)
  }

  onAutoRoomSelected(selection: MatAutocompleteSelectedEvent) {
    this.selectedRoom = selection.option.value
    this.firstFormGroup.patchValue({
      deviceLocation: this.selectedRoom?.room_number
    })
    console.log('selected room', this.selectedRoom)
  }

  /** Called as user types. Auto assign the user input if it matches exactly the item
   * but the user don't select it.
   */
  onDescriptionInputChange(userInput: string): void {
    const matchingItem = this.allItemsOptions.find(item => item.description.toLowerCase() == userInput.toLowerCase())
    if (matchingItem && !this.noMatchingProductDescription) {
      this.selectedProductType = matchingItem

      this.firstFormGroup.patchValue({
        deviceName: this.selectedProductType?.name ?? '',
        deviceDescription: this.selectedProductType?.description ?? '',
      })
      console.log('auto assigned by matching input:', this.selectedProductType)
    }
    /** Set selected Product to null to prevent auto assigning falsely.
     * If the item type/name/description is not exactly the same, that means the item is unique.
     */
    if (!matchingItem) {
      this.selectedProductType = null
      this.firstFormGroup.patchValue({
        deviceDescription: this.firstFormGroup.value.deviceDescription
      })
    }
  }

  onDeviceTypeInputChange(userInput: string) {
    const matchingItem = this.allItemsOptions.find(item => item.name.toLowerCase() == userInput.toLowerCase())
    /** Set selected Product to null to prevent auto assigning falsely.
     * If the item type/name/description is not exactly the same, that means the item is unique.
     */
    if (!matchingItem) {
      this.selectedProductType = null
      this.firstFormGroup.patchValue({
        deviceName: this.firstFormGroup.value.deviceName
      })
    }
  }

  onRoomInputChange(userInput: string) {
    /** Auto assign room if matches exactly */
    const matchingRoom = this.allRoomsOptions.find(room => room.room_number.toLowerCase() == userInput.toLowerCase())
    if (matchingRoom) {
      this.selectedRoom = matchingRoom
      this.firstFormGroup.patchValue({
        deviceLocation: this.selectedRoom?.room_number
      })
    }
  }

  /** Submit form results */
  createNewDevice(): void {
    /** If no matching anything in the database, set id to null
     * to let the database assign new id for it.
     * 
     * If there already exists the item, send the id to the database.
     */
    let productType: ProductType
    let room: RoomInterface
    if (this.selectedProductType) {
       productType = this.selectedProductType
    } else {
      productType = {
        id: null,
        name: this.firstFormGroup.value.deviceName,
        description: this.firstFormGroup.value.deviceDescription,
      }
    }

    if (this.selectedRoom) {
      room = this.selectedRoom
    } else {
      room = {
        id: null,
        room_number: this.firstFormGroup.value.deviceLocation
      }
    }

    /** In the future we can add multiple devices at once (Choose quantity to add)
     * That is why the type expects an array.
     */
    const newDeviceData: NewDeviceData[] = [{
      product_type: productType,
      annotation: this.firstFormGroup.value.deviceAnnotation,
      current_room: room
    }]

    this.dialogRef.close(newDeviceData)
  }


  private _filter(value: string | ProductType, options: ProductType[]): ProductType[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()
    return options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterDescription(value: string | ProductType, options: ProductType[]): ProductType[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.description.toLowerCase()
    return options.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  private _filterRoom(value: string | RoomInterface, options: RoomInterface[]): RoomInterface[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.room_number.toLowerCase()
    return options.filter(option => option.room_number.toLowerCase().includes(filterValue))
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
