import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomOverviewPageComponent } from './room-overview.page';

const routes: Routes = [
  {
    path: '',
    component: RoomOverviewPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
