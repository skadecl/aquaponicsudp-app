import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { UsersComponent } from "./users/users.component";
import { SensorsComponent } from "./sensors/sensors.component";
import { ActuatorsComponent } from './actuators/actuators.component';
import { AlarmsComponent } from './alarms/alarms.component';
import { DetailSensorComponent } from './sensors/detail-sensor/detail-sensor.component';
import { ActuatorDetailComponent } from './actuators/actuator-detail/actuator-detail.component';
import { AlarmDetailComponent } from './alarms/alarm-detail/alarm-detail.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'sensors',
        component: SensorsComponent
      },
      {
        path: 'sensors/:id',
        component: DetailSensorComponent
      },
      {
        path: 'actuators',
        component: ActuatorsComponent
      },
      {
        path: 'actuators/:id',
        component: ActuatorDetailComponent
      },
      {
        path: 'alarms',
        component: AlarmsComponent
      },
      {
        path: 'alarms/:id',
        component: AlarmDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
