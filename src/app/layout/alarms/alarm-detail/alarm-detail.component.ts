import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlarmService } from '../alarm.service';
import { Alarm } from '../../../models/alarm.model';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/finally';
import { AlarmEditComponent } from '../alarm-edit/alarm-edit.component';
import { SubscriptionService } from '../../../shared/subscription.service';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-alarm-detail',
  templateUrl: './alarm-detail.component.html',
  styleUrls: ['./alarm-detail.component.scss']
})
export class AlarmDetailComponent implements OnInit, OnDestroy {
  alarm: Alarm;
  id: number;
  subscription: Subscription;
  loading = true;
  alLoading = false;
  confirmText = '';
  dialogMessage: string;
  @ViewChild('dm') dialogModal;
  @ViewChild('cm') confirmModal;
  @ViewChild(AlarmEditComponent) editAlarm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private alarmService: AlarmService,
              private subscriptionService: SubscriptionService,
              private modalService: NgbModal,
              private auth: AuthService
  ) { }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    this.alarm = this.alarmService.getAlarm(this.id);
    if (this.alarm) {
      this.loading = false;
    }
    this.subscription = this.alarmService.alarmsChanged
      .subscribe(
        () => {
          this.alarm = this.alarmService.getAlarm(this.id);
          if (this.alarm) {
            this.loading = false;
          } else {
            console.log('Error al traer alarma');
          }
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  dialog(message: string) {
    this.dialogMessage = message;
    this.modalService.open(this.dialogModal);
  }


  isSubscribed() {
    return this.subscriptionService.isSubscribed(this.id);
  }

  onEditAlarm() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.editAlarm.openEditModal(this.alarm, true);
  }

  onEnableAlarm() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'ENCENDER';
    this.alLoading = true;
    this.modalService.open(this.confirmModal).result.then((enable) => {
      if (enable) {
        this.alarmService.updateAlarm(+this.id, {status: 1})
          .finally(
            () => this.alLoading = false
          )
          .subscribe(
            (alarm: Alarm) => this.alarmService.setAlarm(+this.id, alarm),
            (err) => console.log(err)
          );
      }
    });
  }

  onDisableAlarm() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'DESACTIVAR';
    this.alLoading = true;
    this.modalService.open(this.confirmModal).result.then((disable) => {
      if (disable) {
        this.alarmService.updateAlarm(+this.id, {status: 0})
          .finally(
            () => this.alLoading = false
          )
          .subscribe(
            (alarm: Alarm) => this.alarmService.setAlarm(+this.id, alarm),
            (err) => console.log(err)
          );
      }
    });
  }

  onDeleteAlarm() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'ELIMINAR';
    this.alLoading = true;
    this.modalService.open(this.confirmModal).result.then((remove) => {
      if (remove) {
        this.alarmService.deleteAlarm(+this.id)
          .finally(
            () => {
              this.alLoading = false;
              this.router.navigate(['../'], {relativeTo: this.route});
            }
          )
          .subscribe(
            () => this.alarmService.removeAlarm(+this.id),
            (err) => console.log(err)
          );
      }
    });
  }

  onSubscribe() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.alLoading = true;
    this.subscriptionService.subscribeAlarm(this.id)
      .finally(
        () => this.alLoading = false
      )
      .subscribe(
        () => {
          this.subscriptionService.addSubscription(this.alarm);
          this.dialog('Suscripción agregada con éxito');
        },
        (err) => console.log(err)
      );
  }

  onUnsubscribe() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.alLoading = true;
    this.subscriptionService.unsubscribeAlarm(this.id)
      .finally(
        () => this.alLoading = false
      )
      .subscribe(
        () => {
          this.subscriptionService.removeSubscription(this.id);
          this.dialog('Suscripción eliminada!');
        },
        (err) => console.log(err)
      );
  }

  onFinish(alarm: Alarm) {
    this.alarm = alarm;
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



}
