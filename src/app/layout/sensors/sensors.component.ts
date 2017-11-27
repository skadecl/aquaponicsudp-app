import { Component, ContentChild, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Sensor } from '../../models/sensor.model';
import { SensorService } from './sensor.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/finally';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { SensorEditComponent } from './sensor-edit/sensor-edit.component';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})
export class SensorsComponent implements OnInit, OnDestroy {
  sensors: Sensor[] = [];
  subscription: Subscription;
  loading = true;
  refreshing = false;
  confirmText: string;
  @ViewChild('cm') confirmModal;
  @ViewChild(SensorEditComponent) sensorEdit;

  constructor(
    private sensorService: SensorService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sensors = this.sensorService.getSensors();
    if (this.sensors.length) {
      this.loading = false;
    }
    this.subscription = this.sensorService.sensorsChanged.subscribe(
      () => {
        this.sensors = this.sensorService.getSensors();
        this.loading = false;
        this.refreshing = false;
      }
    );
  }

  onRefresh() {
    this.refreshing = true;
    this.sensorService.fetchSensors();
  }

  onEnableSensor(id: number, button: HTMLButtonElement) {
    this.confirmText = 'activar';
    this.modalService.open(this.confirmModal).result.then((enable) => {
      if (enable) {
        button.disabled = true;
        this.sensorService.updateSensor(+id, {status: 1})
          .finally(
            () => button.disabled = true
          )
          .subscribe(
            (sensor: Sensor) => this.sensorService.setSensor(+id, sensor),
            (err) => console.log(err)
          );
      }
    });
  }

  onDisableSensor(id: number, button: HTMLButtonElement) {
    this.confirmText = 'desactivar';
    this.modalService.open(this.confirmModal).result.then((disable) => {
      if (disable) {
        button.disabled = true;
        this.sensorService.updateSensor(+id, {status: 0})
          .finally(
            () => button.disabled = true
          )
          .subscribe(
            (sensor: Sensor) => this.sensorService.setSensor(+id, sensor),
            (err) => console.log(err)
          );
      }
    });
  }

  onEnterSensor(id: number) {
    if (!this.loading && !this.refreshing) {
      this.router.navigate([id], {relativeTo: this.route});
    }
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}
