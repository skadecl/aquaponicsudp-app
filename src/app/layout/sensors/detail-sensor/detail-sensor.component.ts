import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SensorService } from '../sensor.service';
import { Sensor } from '../../../models/sensor.model';
import { Subscription } from 'rxjs/Subscription';
import { DetailSensorAlarmsComponent } from '../detail-sensor-alarms/detail-sensor-alarms.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/finally';
import { SensorEditComponent } from '../sensor-edit/sensor-edit.component';


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
  @ViewChild(DetailSensorAlarmsComponent) alarmsView;
  @ViewChild(SensorEditComponent) editSensor;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sensorService: SensorService,
              private modalService: NgbModal
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onEnableSensor() {
    this.confirmText = 'ACTIVAR';
    this.senLoading = true;
    this.modalService.open(this.confirmModal).result.then((enable) => {
      if (enable) {
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
    this.confirmText = 'DESACTIVAR';
    this.senLoading = true;
    this.modalService.open(this.confirmModal).result.then((disable) => {
      if (disable) {
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
    this.confirmText = 'eliminar';
    this.senLoading = true;
    this.modalService.open(this.confirmModal).result.then((remove) => {
      if (remove) {
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
