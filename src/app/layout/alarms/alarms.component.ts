import { Component, OnInit, ViewChild } from '@angular/core';
import { AlarmService } from './alarm.service';
import { Alarm } from '../../models/alarm.model';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AlarmEditComponent } from './alarm-edit/alarm-edit.component';
import { SubscriptionService } from '../../shared/subscription.service';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent implements OnInit {
  alarms: Alarm[];
  subscription: Subscription;
  confirmText: string;
  dialogMessage: string;
  @ViewChild('dm') dialogModal;
  @ViewChild('cm') confirmModal;
  loading = true;
  refreshing = false;
  alLoading = false;
  @ViewChild(AlarmEditComponent) editAlarm;

  constructor(private alarmService: AlarmService,
              private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute,
              private subscriptionService: SubscriptionService
  ) { }

  ngOnInit() {
    this.alarms = this.alarmService.getAlarms();
    if (this.alarms) { this.loading = false; }

    this.subscription = this.alarmService.alarmsChanged
      .subscribe(
        () => {
          this.alarms = this.alarmService.getAlarms();
          if (this.alarms) { this.loading = this.refreshing = false; console.log(this.alarms);}
        },
        (err) => console.log(err)
      );
  }

  onRefresh() {
    this.refreshing = true;
    this.alarmService.fetchAlarms();
  }

  dialog(message: string) {
    this.dialogMessage = message;
    this.modalService.open(this.dialogModal);
  }

  onEnterAlarm(id: number) {
    if (!this.loading && !this.refreshing) {
      this.router.navigate([id], {relativeTo: this.route});
    }
  }

  isSubscribed(id: number) {
    return this.subscriptionService.isSubscribed(id);
  }

  onEnableAlarm(id: number) {
    this.confirmText = 'ENCENDER';
    this.modalService.open(this.confirmModal).result.then((enable) => {
      if (enable) {
        this.alLoading = true;
        this.alarmService.updateAlarm(+id, {status: 1})
          .finally(
            () => this.alLoading = false
          )
          .subscribe(
            (alarm: Alarm) => this.alarmService.patchAlarm(+id, alarm, ['sensor']),
            (err) => console.log(err)
          );
      }
    });
  }

  onDisableAlarm(id: number) {
    this.confirmText = 'APAGAR';
    this.modalService.open(this.confirmModal).result.then((disable) => {
      if (disable) {
        this.alLoading = true;
        this.alarmService.updateAlarm(+id, {status: 0})
          .finally(
            () => this.alLoading = false
          )
          .subscribe(
            (alarm: Alarm) => this.alarmService.patchAlarm(+id, alarm, ['sensor']),
            (err) => console.log(err)
          );
      }
    });
  }

  onDeleteAlarm(id: number) {
    this.confirmText = 'ELIMINAR';
    this.modalService.open(this.confirmModal).result.then((remove) => {
      if (remove) {
        this.alLoading = true;
        this.alarmService.deleteAlarm(id)
          .finally(
            () => this.alLoading = false
          )
          .subscribe(
            () => this.alarmService.removeAlarm(id),
            (err) => console.log(err)
          );
      }
    });
  }

  onAlarmEdited(alarm: Alarm) {
    this.alarmService.patchAlarm(alarm.id, alarm, ['sensor']);
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

  onSubscribe(alarm: Alarm) {
    this.alLoading = true;
    this.subscriptionService.subscribeAlarm(alarm.id)
      .finally(
        () => this.alLoading = false
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
    this.alLoading = true;
    this.subscriptionService.unsubscribeAlarm(id)
      .finally(
        () => this.alLoading = false
      )
      .subscribe(
        () => {
          this.subscriptionService.removeSubscription(id);
          this.dialog('Suscripción eliminada!');
        },
        (err) => console.log(err)
      );
  }

}
