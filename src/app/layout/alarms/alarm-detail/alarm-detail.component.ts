import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlarmService } from '../alarm.service';
import { Alarm } from '../../../models/alarm.model';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/finally';
import { AlarmEditComponent } from '../alarm-edit/alarm-edit.component';


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
  actLoading = false;
  confirmText = '';
  @ViewChild('cm') confirmModal;
  @ViewChild(AlarmEditComponent) editAlarm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private alarmService: AlarmService,
              private modalService: NgbModal
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

  onEnableAlarm() {
    this.confirmText = 'ENCENDER';
    this.actLoading = true;
    this.modalService.open(this.confirmModal).result.then((enable) => {
      if (enable) {
        this.alarmService.updateAlarm(+this.id, {status: 1})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (alarm: Alarm) => this.alarmService.setAlarm(+this.id, alarm),
            (err) => console.log(err)
          );
      }
    });
  }

  onDisableAlarm() {
    this.confirmText = 'APAGAR';
    this.actLoading = true;
    this.modalService.open(this.confirmModal).result.then((disable) => {
      if (disable) {
        this.alarmService.updateAlarm(+this.id, {status: 0})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (alarm: Alarm) => this.alarmService.setAlarm(+this.id, alarm),
            (err) => console.log(err)
          );
      }
    });
  }

  onDeleteAlarm() {
    this.confirmText = 'ELIMINAR';
    this.actLoading = true;
    this.modalService.open(this.confirmModal).result.then((remove) => {
      if (remove) {
        this.alarmService.deleteAlarm(+this.id)
          .finally(
            () => {
              this.actLoading = false;
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
