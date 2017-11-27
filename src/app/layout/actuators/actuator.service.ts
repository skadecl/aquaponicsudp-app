import { Injectable, OnInit } from '@angular/core';
import { Globals } from '../../shared/globals';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Actuator } from '../../models/actuator.model';

@Injectable()
export class ActuatorService implements OnInit {
  actuators: Actuator[] = null;
  actuatorsChanged = new Subject<void>();

  constructor(private globals: Globals, private http: HttpClient) {
    this.fetchActuators();
  }

  ngOnInit() {

  }

  getActuators() {
    if (this.actuators) {
      return this.actuators.slice();
    } else {
      return null;
    }
  }

  getActuator(id: number) {
    if (this.actuators) {
      const actuator = this.actuators.find((act) => {return act.id === id});
      return actuator;
    } else {
      return null;
    }
  }

  addActuator(actuator: Actuator) {
    this.actuators.push(actuator);
    this.actuatorsChanged.next();
  }

  setActuators(actuators: Actuator[]) {
    this.actuators = actuators;
    this.actuatorsChanged.next();
  }

  setActuator(id: number, actuator: Actuator) {
    const index = this.actuators.findIndex((act) => {return act.id === id});
    this.actuators[index] = actuator;
    this.actuatorsChanged.next();
  }

  removeActuator(id: number) {
    const pos = this.actuators.findIndex((act) => act.id === id);
    if (pos >= 0) {
      this.actuators.splice(pos, 1);
      this.actuatorsChanged.next();
    }
  }


  fetchActuators() {
    this.http.get(this.globals.api + '/actuators')
      .subscribe(
        (actuators: Actuator[]) => {
          this.setActuators(actuators);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getAvailableActuators() {
    return this.http.get(this.globals.api + '/available-actuators');
  }

  createActuator(actuator: object) {
    return this.http.post(this.globals.api + '/actuators', actuator);
  }

  updateActuator(id: number, changes: object) {
    return this.http.put(this.globals.api + '/actuators/' + id, changes);
  }

  deleteActuator(id: number) {
    return this.http.delete(this.globals.api + '/actuators/' + id);
  }

  getErrors(id: number, page: number = 1) {
    return this.http.get(this.globals.api + '/actuators/' + id + '/errors?page=' + page);
  }

  getHistory(id: number, page: number = 1) {
    return this.http.get(this.globals.api + '/actuators/' + id + '/history?page=' + page);
  }

}
