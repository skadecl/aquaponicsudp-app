import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorTableComponent } from "./monitor-table/monitor-table.component";
import { MonitorCardComponent } from './monitor-card/monitor-card.component';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgbAlertModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    MonitorTableComponent,
    MonitorCardComponent
  ]
})
export class DashboardModule { }
