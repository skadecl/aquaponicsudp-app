import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Alarm } from '../../../models/alarm.model';
import { AlarmService } from '../../alarms/alarm.service';
import { SubscriptionService } from '../../../shared/subscription.service';
import 'rxjs/add/operator/finally';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlarmEditComponent } from '../../alarms/alarm-edit/alarm-edit.component';

@Component({
  selector: 'app-detail-sensor-alarms',
  templateUrl: './detail-sensor-alarms.component.html',
  styleUrls: ['./detail-sensor-alarms.component.scss']
})
export class DetailSensorAlarmsComponent implements OnInit {
  alarms: Alarm[] = [];
  @Input() id: number;
  @Input() unit: string;
  @ViewChild('dm') dialogModal;
  @ViewChild('cm') confirmModal;
  @ViewChild(AlarmEditComponent) editAlarm;
  loading = false;
  subLoading = false;
  creating = false;
  dialogMessage = '';
  confirmText = '';

  constructor(private alarmService: AlarmService,
              private subscriptionService: SubscriptionService,
              private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getAlarms();
  }

  getAlarms() {
    this.alarmService.getAlarmsBySensor(this.id)
      .subscribe(
        (alarms: Alarm[]) => this.alarms = alarms,
        (err) => console.log(err)
      );
  }

  isSubscribed(id: number) {
    return this.subscriptionService.isSubscribed(id);
  }

  onSubscribe(alarm: Alarm) {
    this.subLoading = true;
    this.subscriptionService.subscribeAlarm(alarm.id)
      .finally(
        () => this.subLoading = false
      )
      .subscribe(
        () => {
          this.subscriptionService.addSubscription(alarm);
          this.dialog('Suscripción agregada con éxito');
        },
        (err) => console.log(err)
      );
  }

  onUnsubscribe(id: number) {
    this.subLoading = true;
    this.subscriptionService.unsubscribeAlarm(id)
      .finally(
        () => this.subLoading = false
      )
      .subscribe(
        () => {
          this.subscriptionService.removeSubscription(id);
          this.dialog('Suscripción eliminada!');
        },
        (err) => console.log(err)
      );
  }

  onDisableAlarm(id: number) {
    this.confirmText = 'DESACTIVAR';
    this.modalService.open(this.confirmModal).result.then((disable) => {
      if (disable) {
        this.subLoading = true;
        this.alarmService.updateAlarm(id, {status: 0})
          .finally(
            () => this.subLoading = false
          )
          .subscribe(
            (alarm: Alarm) => {
              const pos = this.alarms.findIndex((al) => al.id === id);
              this.alarms[pos] = alarm;
            },
            (err) => console.log(err)
          );
      }
    });
  }

  onEnableAlarm(id: number) {
    this.confirmText = 'ACTIVAR';
    this.modalService.open(this.confirmModal).result.then((enable) => {
      if (enable) {
        this.subLoading = true;
        this.alarmService.updateAlarm(id, {status: 1})
          .finally(
            () => this.subLoading = false
          )
          .subscribe(
            (alarm: Alarm) => {
              const pos = this.alarms.findIndex((al) => al.id === id);
              this.alarms[pos] = alarm;
            },
            (err) => console.log(err)
          );
      }
    });
  }

  dialog(message: string) {
    this.dialogMessage = message;
    this.modalService.open(this.dialogModal);
  }

  parseAlarmType(type: number) {
    switch (type) {
      case 0: {
        return 'Exacto';
      }
      case 1: {
        return 'Bajo';
      }
      case 2: {
        return 'Sobre';
      }
      default: {
        return 'Desconocido';
      }
    }
  }

  newAlarm() {
    this.editAlarm.openEditModal(null, false);
  }


  onFinish(alarm: Alarm) {
    const pos = this.alarms.findIndex((al) => +al.id === +alarm.id);
    if (pos >= 0) {
      this.alarms[pos] = alarm;
      this.dialog('Los cambios han sido guardados.');
    } else {
      this.alarms.push(alarm);
    }
  }

  onDeleteAlarm(id: number) {
    this.confirmText = 'ELIMINAR';
    this.modalService.open(this.confirmModal).result.then((remove) => {
      if (remove) {
        this.subLoading = true;
        this.alarmService.deleteAlarm(id)
          .finally(
            () => this.subLoading = false
          )
          .subscribe(
            () => {
              const pos = this.alarms.findIndex((alarm) => alarm.id === id);
              this.alarms.splice(pos, 1);
            },
            (err) => console.log(err)
          );
      }
    });
  }

}
