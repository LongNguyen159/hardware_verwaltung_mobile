import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit,AfterViewInit {
  @Input() dataSource: any[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'deviceName', 'location', 'inLage', 'duration'];
  
  mockData = [
    { id: 1, deviceName: 'Device A', location: 'Location 1', inLage: 'Yes', duration: '2 hours' },
    { id: 2, deviceName: 'Device B', location: 'Location 2', inLage: 'No', duration: '1 hour' },
    { id: 3, deviceName: 'Device C', location: 'Location 3', inLage: 'Yes', duration: '3 hours' },
    { id: 4, deviceName: 'Device D', location: 'Location 4', inLage: 'Yes', duration: '4 hours' },
    { id: 5, deviceName: 'Device E', location: 'Location 5', inLage: 'No', duration: '2.5 hours' }
  ];

  tableDataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.dataSource = this.mockData

  }

  ngAfterViewInit(): void {
    this.tableDataSource = new MatTableDataSource(this.dataSource);
    this.tableDataSource.paginator = this.paginator;
  }
}
