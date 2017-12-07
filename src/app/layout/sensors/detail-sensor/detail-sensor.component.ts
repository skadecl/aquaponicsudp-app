import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SensorService } from '../sensor.service';
import { Sensor } from '../../../models/sensor.model';
import { Subscription } from 'rxjs/Subscription';
import { DetailSensorAlarmsComponent } from '../detail-sensor-alarms/detail-sensor-alarms.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/finally';
import { SensorEditComponent } from '../sensor-edit/sensor-edit.component';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-detail-sensor',
  templateUrl: './detail-sensor.component.html',
  styleUrls: ['./detail-sensor.component.scss']
})
export class DetailSensorComponent implements OnInit, OnDestroy {
  sensor: Sensor;
  id: number;
  subscription: Subscription;
  loading = true;
  senLoading = false;
  confirmText = '';
  tab = 'alarms';
  @ViewChild('cm') confirmModal;
  @ViewChild('dm') dialogModal;
  dialogMessage: string;
  @ViewChild(DetailSensorAlarmsComponent) alarmsView;
  @ViewChild(SensorEditComponent) editSensor;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sensorService: SensorService,
              private modalService: NgbModal,
              private auth: AuthService
  ) { }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    this.sensor = this.sensorService.getSensor(this.id);
    if (this.sensor) {
      this.loading = false;
    }
    this.subscription = this.sensorService.sensorsChanged
      .subscribe(
        () => {
          this.sensor = this.sensorService.getSensor(this.id);
          if (this.sensor) {
            this.loading = false;
          } else {
            console.log('Error al traer sensor');
          }
        }
      );
  }

  setTab(tab: string) {
    this.tab = tab;
  }

  dialog(message: string) {
    this.dialogMessage = message;
    this.modalService.open(this.dialogModal);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onEnableSensor() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'ACTIVAR';
    this.modalService.open(this.confirmModal).result.then((enable) => {
      if (enable) {
        this.senLoading = true;
        this.sensorService.updateSensor(+this.id, {status: 1})
          .finally(
            () => this.senLoading = false
          )
          .subscribe(
            (sensor: Sensor) => this.sensorService.setSensor(+this.id, sensor),
            (err) => console.log(err)
          );
      }
    });
  }

  onDisableSensor() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'DESACTIVAR';
    this.modalService.open(this.confirmModal).result.then((disable) => {
      if (disable) {
        this.senLoading = true;
        this.sensorService.updateSensor(+this.id, {status: 0})
          .finally(
            () => this.senLoading = false
          )
          .subscribe(
            (sensor: Sensor) => this.sensorService.setSensor(+this.id, sensor),
            (err) => console.log(err)
          );
      }
    });
  }

  onDeleteSensor() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'ELIMINAR';
    this.modalService.open(this.confirmModal).result.then((remove) => {
      if (remove) {
        this.senLoading = true;
        this.sensorService.deleteSensor(+this.id)
          .finally(
            () => {
              this.senLoading = false;
              this.router.navigate(['../../list'], {relativeTo: this.route});
            }
          )
          .subscribe(
            () => this.sensorService.removeSensor(+this.id),
            (err) => console.log(err)
          );
      }
    });
  }

  onAddAlarm() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.alarmsView.newAlarm();
  }

  onEditSensor() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.editSensor.openModal(true, this.sensor);
  }

  parseType(type: number) {
    switch (type) {
      case 0: {
        return 'Switch';
      }
      case 1: {
        return 'Digital';
      }
      case 2: {
        return 'Analógico';
      }
      default: {
        return 'Desconocido';
      }
    }
  }

}
