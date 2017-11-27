import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./dashboard.component";
import { MonitorCardComponent } from "./monitor-card/monitor-card.component";
import { MonitorTableComponent } from "./monitor-table/monitor-table.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'card'
      },
      {
        path: 'card',
        component: MonitorCardComponent
      },
      {
        path: 'table',
        component: MonitorTableComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
