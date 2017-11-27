import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Alarm } from '../models/alarm.model';
import { Subject } from 'rxjs/Subject';
import { Actuator } from '../models/actuator.model';
import { Sensor } from '../models/sensor.model';
import { Globals } from './globals';
import 'rxjs/add/operator/finally';

@Injectable()
export class FetcherService implements OnInit {
  alarmsFetched = new Subject<void>();
  sensorsFetched = new Subject<void>();
  actuatorsFetched = new Subject<void>();

  bufferedAlarms: Alarm[] = [];
  bufferedSensors: Sensor[] = [];
  bufferedActuators: Actuator[] = [];

  firstFetch = true;

  constructor(private globals: Globals, private http: HttpClient) {
    this.fetchData();
  }

  ngOnInit() {

  }

  getSensors() {
    return this.bufferedSensors.slice();
  }

  getActuators() {
    return this.bufferedActuators.slice();
  }

  getAlarms() {
    return this.bufferedAlarms.slice();
  }

  private getOptions() {
    const options = {
      sensors: this.sensorsFetched.observers.length > 0 || this.firstFetch,
      actuators: this.actuatorsFetched.observers.length > 0 || this.firstFetch,
      alarms: this.alarmsFetched.observers.length > 0 || this.firstFetch
    };
    return options;
  }

  fetchData() {
    this.http.post(this.globals.api + '/fetch', this.getOptions())
      .finally(
        () => {
          setTimeout(this.fetchData.bind(this), this.globals.updateInterval);
          if (this.firstFetch) {this.firstFetch = false;}
        }
      )
      .subscribe(
        (data: {sensors?: Sensor[], actuators?: Actuator[], alarms?: Alarm[]}) => {
          if (data.sensors) {
            this.bufferedSensors = data.sensors;
            this.sensorsFetched.next();
          }
          if (data.actuators) {
            this.bufferedActuators = data.actuators;
            this.actuatorsFetched.next();
          }
          if (data.alarms) {
            this.bufferedAlarms = data.alarms;
            this.alarmsFetched.next();
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

}
