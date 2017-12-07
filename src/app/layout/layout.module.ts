import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbDropdownModule, NgbModalModule, NgbPopoverModule, NgbTabsetModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from '../core/header/header.component';
import { SidebarComponent } from '../core/sidebar/sidebar.component';
import { UsersComponent } from './users/users.component';
import { SensorsComponent } from './sensors/sensors.component';
import { SensorService } from './sensors/sensor.service';
import { ActuatorsComponent } from './actuators/actuators.component';
import { ActuatorService } from './actuators/actuator.service';
import { AlarmsComponent } from './alarms/alarms.component';
import { AlarmService } from './alarms/alarm.service';
import { DetailSensorComponent } from './sensors/detail-sensor/detail-sensor.component';
import { IconPickerComponent } from '../shared/icon-picker.component';
import { ColorPickerComponent } from '../shared/color-picker.component';
import { FormsModule } from '@angular/forms';
import { DetailSensorAlarmsComponent } from './sensors/detail-sensor-alarms/detail-sensor-alarms.component';
import { SubscriptionService } from '../shared/subscription.service';
import { DetailSensorHistoryComponent } from './sensors/detail-sensor-history/detail-sensor-history.component';
import { DetailSensorErrorsComponent } from './sensors/detail-sensor-errors/detail-sensor-errors.component';
import { SensorEditComponent } from './sensors/sensor-edit/sensor-edit.component';
import { ActuatorEditComponent } from './actuators/actuator-edit/actuator-edit.component';
import { ActuatorDetailComponent } from './actuators/actuator-detail/actuator-detail.component';
import { AlarmEditComponent } from './alarms/alarm-edit/alarm-edit.component';
import { ActuatorDetailErrorsComponent } from './actuators/actuator-detail-errors/actuator-detail-errors.component';
import { ActuatorDetailHistoryComponent } from './actuators/actuator-detail-history/actuator-detail-history.component';
import { AlarmDetailComponent } from './alarms/alarm-detail/alarm-detail.component';
import { AlarmDetailHistoryComponent } from './alarms/alarm-detail-history/alarm-detail-history.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatisticsErrorsComponent } from './statistics/statistics-errors/statistics-errors.component';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule.forRoot(),
    NgbTooltipModule.forRoot(),
    NgbPopoverModule.forRoot(),
    NgbModalModule.forRoot(),
    NgbTabsetModule.forRoot(),
    NgxChartsModule,
    ChartsModule,
    FormsModule,
    LayoutRoutingModule
  ],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    UsersComponent,
    SensorsComponent,
    ActuatorsComponent,
    ActuatorEditComponent,
    ActuatorDetailComponent,
    ActuatorDetailErrorsComponent,
    ActuatorDetailHistoryComponent,
    AlarmsComponent,
    AlarmEditComponent,
    AlarmDetailComponent,
    AlarmDetailHistoryComponent,
    SensorEditComponent,
    DetailSensorComponent,
    IconPickerComponent,
    ColorPickerComponent,
    DetailSensorAlarmsComponent,
    DetailSensorHistoryComponent,
    DetailSensorErrorsComponent,
    StatisticsComponent,
    StatisticsErrorsComponent
  ],
  providers: [SensorService, ActuatorService, AlarmService, SubscriptionService]
})
export class LayoutModule { }
