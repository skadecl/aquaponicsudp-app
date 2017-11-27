import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Alarm } from '../../../models/alarm.model';
import { AlarmService } from '../alarm.service';
import 'rxjs/add/operator/finally';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActuatorService } from '../../actuators/actuator.service';
import { Actuator } from '../../../models/actuator.model';

@Component({
  selector: 'app-alarm-edit',
  templateUrl: './alarm-edit.component.html',
  styleUrls: ['./alarm-edit.component.scss']
})
export class AlarmEditComponent implements OnInit {
  alarm: Alarm;
  @ViewChild('eam') newAlarmModal;
  @Input() sensorUnit: string;
  @Input() sensorId: number;
  @Output() onFinish: EventEmitter<Alarm> = new EventEmitter<Alarm>();
  modalInstance: NgbModalRef;
  selectedColor = '';
  selectedIcon = '';
  validated = false;
  duplicated = false;
  effects = [];
  availableActuators = [];
  noActuators = false;
  edit = false;

  constructor(private alarmService: AlarmService,
              private modalService: NgbModal,
              private actuatorService: ActuatorService
  ) { }

  ngOnInit() {
  }


  getAvailableActuators() {
    this.actuatorService.getAvailableActuators()
      .subscribe(
        (actuators: Actuator[]) => this.availableActuators = this.availableActuators.concat(actuators),
        (err) => console.log(err)
      );
  }

  getAlarmEffects() {
    this.alarmService.getAlarmEffects(this.alarm.id)
      .subscribe(
        (effects: any[]) => {
          effects.forEach(
            (effect) => {
              this.availableActuators.push({id: effect.actuator.id, name: effect.actuator.name});
              this.effects.push({actuator: effect.actuator.id, status: effect.status, alarm: this.alarm.id});
            }
          )
        },
        (err) => console.log(err)
      );
  }

  openEditModal(alarm: Alarm, edit: boolean = false) {
    this.edit = edit;
    if (this.edit) {
      this.alarm = {...alarm};
      this.getAlarmEffects();
    } else {
      this.alarm = new Alarm();
    }
    this.selectedColor = this.alarm.style;
    this.selectedIcon = this.alarm.icon;
    this.effects = [];
    this.availableActuators = [];
    this.validated = false;
    this.duplicated = false;
    this.noActuators = false;
    this.modalInstance = this.modalService.open(this.newAlarmModal);
    this.getAvailableActuators();
  }

  onSelectIcon(icon: string) {
    this.selectedIcon = icon;
  }

  onSelectColor(color: string) {
    this.selectedColor = color;
  }

  onAddEffect() {
    if (this.availableActuators.length) {
      this.effects.push({actuator: '', status: '', alarm: this.alarm.id});
    } else {
      this.noActuators = true;
    }
  }

  onRemoveEffect(index: number) {
    this.effects.splice(index, 1);
    this.findDuplicates();
  }

  findDuplicates() {
    console.log(this.effects);
    for (let i = 0 ; i < this.effects.length ; i++) {
      for (let j = 0 ; j < this.effects.length ; j++) {
        if (i === j) { continue; }
        if (+this.effects[i].actuator === +this.effects[j].actuator) { this.duplicated = true; return; }
      }
    }
    this.duplicated = false;
  }

  onSubmit(f) {
    this.validated = true;
    if (f.form.valid && !this.duplicated) {
      const formAlarm = f.form.value;
      formAlarm['effects'] = this.effects;

      console.log(formAlarm);

      if (this.edit) {
        this.alarmService.updateAlarm(this.alarm.id, formAlarm)
          .subscribe(
            (alarm: Alarm) => {
              this.onFinish.emit(alarm);
              this.modalInstance.close();
            },
            (err) => console.log(err)
          );
      } else {
        formAlarm['sensor'] = this.sensorId;
        this.alarmService.createAlarm(formAlarm)
          .subscribe(
            (alarm: Alarm) => {
              this.onFinish.emit(alarm);
              this.modalInstance.close();
            },
            (err) => console.log(err)
          );
      }
    }
  }

}
