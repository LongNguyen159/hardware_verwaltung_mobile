import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewDeviceDialogComponent } from '../../components/new-device-dialog/new-device-dialog.component';
import { DeviceInput, DeviceMetaData } from '../../models/device-models';
import { DeviceService } from '../../service/device.service';
import { Router } from '@angular/router';
import { generateQRCodeFromJSON } from '../../utils/utils';
@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, AfterViewInit {
  @Input() dataSource: any[]; /** change mockdata to this later. */

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dialogRef: MatDialogRef<NewDeviceDialogComponent>

  displayedColumns: string[] = ['id', 'deviceName', 'location', 'inLage', 'duration', 'actions'];
  tableDataSource: MatTableDataSource<any>;

  mockData: DeviceMetaData[] = [
    { id: 1, deviceName: 'ElectroTech M1', location: 'Location 1', inLage: 'Yes', duration: '2 hours' },
    { id: 2, deviceName: 'SmartGear X9', location: 'Location 2', inLage: 'No', duration: '1 hour' },
    { id: 3, deviceName: 'TechWiz S3', location: 'Location 3', inLage: 'Yes', duration: '3 hours' },
    { id: 4, deviceName: 'GigaTech G4', location: 'Location 4', inLage: 'Yes', duration: '4 hours' },
    { id: 5, deviceName: 'InnoTech Z1', location: 'Location 5', inLage: 'No', duration: '2.5 hours' },
    { id: 6, deviceName: 'TechSmart R2', location: 'Location 6', inLage: 'Yes', duration: '1.5 hours' },
    { id: 7, deviceName: 'EcoTech P7', location: 'Location 7', inLage: 'No', duration: '3 hours' },
    { id: 8, deviceName: 'MegaGadget F5', location: 'Location 8', inLage: 'Yes', duration: '2 hours' },
    { id: 9, deviceName: 'HyperGear X2', location: 'Location 9', inLage: 'No', duration: '1 hour' },
    { id: 10, deviceName: 'EcoTech M2', location: 'Location 10', inLage: 'Yes', duration: '4 hours' },
    { id: 11, deviceName: 'SmartWiz Z2', location: 'Location 11', inLage: 'Yes', duration: '2.5 hours' },
    { id: 12, deviceName: 'ElectroTech G3', location: 'Location 12', inLage: 'No', duration: '3.5 hours' },
    { id: 13, deviceName: 'GigaTech T8', location: 'Location 13', inLage: 'Yes', duration: '2 hours' },
    { id: 14, deviceName: 'SmartGear X3', location: 'Location 14', inLage: 'Yes', duration: '1.5 hours' },
    { id: 15, deviceName: 'MegaGadget F6', location: 'Location 15', inLage: 'No', duration: '2 hours' },
    { id: 16, deviceName: 'InnoTech S4', location: 'Location 16', inLage: 'Yes', duration: '3 hours' },
    { id: 17, deviceName: 'EcoTech M3', location: 'Location 17', inLage: 'Yes', duration: '4 hours' },
    { id: 18, deviceName: 'HyperGear X4', location: 'Location 18', inLage: 'No', duration: '1 hour' },
    { id: 19, deviceName: 'TechSmart G5', location: 'Location 19', inLage: 'Yes', duration: '2.5 hours' },
    { id: 20, deviceName: 'SmartWiz Z3', location: 'Location 20', inLage: 'No', duration: '3 hours' },
    { id: 21, deviceName: 'ElectroTech R3', location: 'Location 21', inLage: 'Yes', duration: '1.5 hours' },
    { id: 22, deviceName: 'GigaTech T9', location: 'Location 22', inLage: 'Yes', duration: '2 hours' },
    { id: 23, deviceName: 'InnoTech S5', location: 'Location 23', inLage: 'No', duration: '4 hours' },
    { id: 24, deviceName: 'EcoTech M4', location: 'Location 24', inLage: 'Yes', duration: '2.5 hours' },
    { id: 25, deviceName: 'HyperGear X5', location: 'Location 25', inLage: 'Yes', duration: '3 hours' },
    { id: 26, deviceName: 'TechSmart G6', location: 'Location 26', inLage: 'No', duration: '1 hour' },
    { id: 27, deviceName: 'SmartWiz Z4', location: 'Location 27', inLage: 'Yes', duration: '2 hours' },
    { id: 28, deviceName: 'ElectroTech R4', location: 'Location 28', inLage: 'No', duration: '3.5 hours' },
    { id: 29, deviceName: 'GigaTech T10', location: 'Location 29', inLage: 'Yes', duration: '1.5 hours' },
    { id: 30, deviceName: 'InnoTech S6', location: 'Location 30', inLage: 'Yes', duration: '2 hours' },
    { id: 31, deviceName: 'EcoTech M5', location: 'Location 31', inLage: 'No', duration: '4 hours' },
    { id: 32, deviceName: 'HyperGear X6', location: 'Location 32', inLage: 'Yes', duration: '2.5 hours' },
    { id: 33, deviceName: 'TechSmart G7', location: 'Location 33', inLage: 'Yes', duration: '3 hours' },
    { id: 34, deviceName: 'SmartWiz Z5', location: 'Location 34', inLage: 'No', duration: '1 hour' },
    { id: 35, deviceName: 'ElectroTech R5', location: 'Location 35', inLage: 'Yes', duration: '2 hours' },
    { id: 36, deviceName: 'GigaTech T11', location: 'Location 36', inLage: 'Yes', duration: '1.5 hours' },
    { id: 37, deviceName: 'InnoTech S7', location: 'Location 37', inLage: 'No', duration: '2.5 hours' },
    { id: 38, deviceName: 'EcoTech M6', location: 'Location 38', inLage: 'Yes', duration: '3 hours' },
    { id: 39, deviceName: 'HyperGear X7', location: 'Location 39', inLage: 'Yes', duration: '2 hours' },
    { id: 40, deviceName: 'TechSmart G8', location: 'Location 40', inLage: 'No', duration: '4 hours' }
  ];

  qrCodeDataUrl: string;

  constructor(public dialog: MatDialog, private deviceServive: DeviceService, private router: Router) {}

  ngOnInit(): void {
    /** Get device list here, assign tableDataSource to be the result. */
    this.tableDataSource = new MatTableDataSource(this.mockData); /** Change to real data here; 'dataSource' is real data */
  }

  ngAfterViewInit(): void {
    this.tableDataSource.sort = this.sort;
    this.tableDataSource.paginator = this.paginator;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }


  openNewDeviceDialog() {
    this.dialogRef = this.dialog.open(NewDeviceDialogComponent, {
      disableClose: false,
    })

    this.dialogRef.afterClosed().subscribe((results: DeviceInput) => {
      if (results) {
        console.log(results)
        /** Create new device, send to API to create new item in DB. Pass device input as args */

        /** Subscribe to backend results, backend should return a JSON.
         * Use that JSON to generate a QR code.
         */
      }
    })
    this.dialogRef = null as any
  }


  navigateToDetailsPage(id: number) {
    this.router.navigate(['/device-details', id])

  }
}



// Name + Location POST request => backend
// backend write new device into DB.
// backend response to POST request: JSON

// frontend JSON -> QR.

/** TODO
 * - [ ] API endpoint for writing new devices (Simon)
 * - [X] New page (device details page)
 * - [X] endpoint for getting device info by ID. (Simon)
 * - [ ] Table actions: Delete rows
 * - [ ] API endpoint for removing rows in DB.
 * - [ ] Starred items: => Then store them in local storage.
 */
