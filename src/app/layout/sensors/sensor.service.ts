import { Injectable, OnInit } from '@angular/core';
import { Globals } from '../../shared/globals';
import { HttpClient } from '@angular/common/http';
import { Sensor } from '../../models/sensor.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SensorService implements OnInit {
  sensors: Sensor[] = [];
  sensorsChanged = new Subject<void>();

  constructor(private globals: Globals, private http: HttpClient) {
    this.fetchSensors();
  }

  ngOnInit() {

  }

  getSensors() {
    return this.sensors.slice();
  }

  getSensor(id: number) {
    const sensor = this.sensors.find((sen) => {return sen.id === id});
    return sensor;
  }

  addSensor(sensor: Sensor) {
    this.sensors.push(sensor);
    this.sensorsChanged.next();
  }

  removeSensor(id: number) {
    const pos = this.sensors.findIndex((sen) => sen.id === id);
    if (pos >= 0) {
      this.sensors.splice(pos, 1);
      this.sensorsChanged.next();
    }
  }

  setSensors(sensors: Sensor[]) {
    this.sensors = sensors;
    this.sensorsChanged.next();
  }

  setSensor(id: number, sensor: Sensor) {
    const index = this.sensors.findIndex((sen) => {return sen.id === id});
    this.sensors[index] = sensor;
    this.sensorsChanged.next();
  }

  updateSensor(id: number, changes: object) {
    return this.http.put(this.globals.api + '/sensors/' + id, changes);
  }

  fetchSensors() {
    this.http.get(this.globals.api + '/sensors')
      .subscribe(
        (sensors: Sensor[]) => {
          this.setSensors(sensors);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  checkSensorName(name: string) {
    return this.http.head(this.globals.api + '/sensors/' + name);
  }

  createSensor(sensor: object) {
    return this.http.post(this.globals.api + '/sensors', sensor);
  }

  deleteSensor(id: number) {
    return this.http.delete(this.globals.api + '/sensors/' + id);
  }

  getErrors(id: number) {
    return this.http.get(this.globals.api + '/sensors/' + id + '/errors');
  }

}
