import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceMetaData } from 'src/app/feature/device_management/models/device-models';

@Component({
  selector: 'app-overview-table',
  templateUrl: './overview-table.component.html',
  styleUrls: ['./overview-table.component.scss']
})
export class OverviewTableComponent implements OnChanges {
  @Input() dataSource: MatTableDataSource<DeviceMetaData>
  @Input() displayedColumns: string[] = []
  @Input() pageSizeOptions: number[] = [5, 10, 20]
  @ViewChild('paginator') paginator: MatPaginator


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'].currentValue) {
      this.dataSource.paginator = this.paginator
    }
  }
}
