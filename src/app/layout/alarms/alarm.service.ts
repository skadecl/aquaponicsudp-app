import { Injectable, OnInit } from '@angular/core';
import { Globals } from '../../shared/globals';
import { HttpClient } from '@angular/common/http';
import { Alarm } from '../../models/alarm.model';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class AlarmService implements OnInit {
  alarms: Alarm[];
  alarmsChanged = new Subject<void>();
  subscription: Subscription;

  constructor(private globals: Globals, private http: HttpClient) {
    this.fetchAlarms();
  }

  ngOnInit() {

  }

  getAlarms() {
    if (this.alarms) {
      return this.alarms.slice();
    } else {
      return null;
    }
  }

  getAlarm(id: number) {
    if (this.alarms) {
      const alarm = this.alarms.find((alm) => {return alm.id === id});
      return alarm;
    } else {
      return null;
    }
  }

  addAlarm(alarm: Alarm) {
    this.alarms.push(alarm);
    this.alarmsChanged.next();
  }

  setAlarms(alarms: Alarm[]) {
    this.alarms = alarms;
    this.alarmsChanged.next();
  }

  setAlarm(id: number, alarm: Alarm) {
    const index = this.alarms.findIndex((alm) => {return alm.id === id});
    this.alarms[index] = alarm;
    this.alarmsChanged.next();
  }

  patchAlarm(id: number, changes: object, keep: string[] = null) {
    const alarm = this.alarms.find((alm) => alm.id === id);
    if (keep) {
      keep.forEach(
        (prop) => {
          delete changes[prop];
        }
      );
    }
    Object.assign(alarm, changes);
  }

  removeAlarm(id: number) {
    const pos = this.alarms.findIndex((alm) => alm.id === id);
    if (pos >= 0) {
      this.alarms.splice(pos, 1);
      this.alarmsChanged.next();
    }
  }


  fetchAlarms() {
    this.http.get(this.globals.api + '/alarms')
      .subscribe(
        (alarms: Alarm[]) => {
          this.setAlarms(alarms);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getAlarmsBySensor(id: number) {
    return this.http.get(this.globals.api + '/sensors/' + id + '/alarms');
  }

  getAlarmEffects(id: number) {
    return this.http.get(this.globals.api + '/alarms/' + id + '/effects');
  }

  updateAlarm(id: number, changes: object) {
    return this.http.put(this.globals.api + '/alarms/' + id, changes);
  }

  createAlarm(alarm: object) {
    return this.http.post(this.globals.api + '/alarms', alarm);
  }

  deleteAlarm(id: number) {
    return this.http.delete(this.globals.api + '/alarms/' + id);
  }

  getHistory(id: number, page: number = 1) {
    return this.http.get(this.globals.api + '/alarms/' + id + '/history?page=' + page);
  }

}
