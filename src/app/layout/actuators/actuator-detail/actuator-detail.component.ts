import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActuatorService } from '../actuator.service';
import { Actuator } from '../../../models/actuator.model';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/finally';
import { ActuatorEditComponent } from '../actuator-edit/actuator-edit.component';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-actuator-detail',
  templateUrl: './actuator-detail.component.html',
  styleUrls: ['./actuator-detail.component.scss']
})
export class ActuatorDetailComponent implements OnInit, OnDestroy {
  actuator: Actuator;
  id: number;
  subscription: Subscription;
  loading = true;
  actLoading = false;
  confirmText = '';
  tab = 'history';
  @ViewChild('cm') confirmModal;
  @ViewChild('dm') dialogModal;
  dialogMessage: string;
  @ViewChild(ActuatorEditComponent) editActuator;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private actuatorService: ActuatorService,
              private modalService: NgbModal,
              private auth: AuthService
  ) { }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    this.actuator = this.actuatorService.getActuator(this.id);
    if (this.actuator) {
      this.loading = false;
    }
    this.subscription = this.actuatorService.actuatorsChanged
      .subscribe(
        () => {
          this.actuator = this.actuatorService.getActuator(this.id);
          if (this.actuator) {
            this.loading = false;
          } else {
            console.log('Error al traer actuator');
          }
        }
      );
  }

  dialog(message: string) {
    this.dialogMessage = message;
    this.modalService.open(this.dialogModal);
  }


  setTab(tab: string) {
    this.tab = tab;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onEditActuator() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.editActuator.openModal(true, this.actuator);
  }

  onEnableActuator() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'ENCENDER';
    this.actLoading = true;
    this.modalService.open(this.confirmModal).result.then((enable) => {
      if (enable) {
        this.actuatorService.updateActuator(+this.id, {status: 1, lock: 1})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (actuator: Actuator) => this.actuatorService.setActuator(+this.id, actuator),
            (err) => console.log(err)
          );
      }
    });
  }

  onDisableActuator() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'APAGAR';
    this.actLoading = true;
    this.modalService.open(this.confirmModal).result.then((disable) => {
      if (disable) {
        this.actuatorService.updateActuator(+this.id, {status: 0, lock: 1})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (actuator: Actuator) => this.actuatorService.setActuator(+this.id, actuator),
            (err) => console.log(err)
          );
      }
    });
  }

  onDeleteActuator() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'ELIMINAR';
    this.actLoading = true;
    this.modalService.open(this.confirmModal).result.then((remove) => {
      if (remove) {
        this.actuatorService.deleteActuator(+this.id)
          .finally(
            () => {
              this.actLoading = false;
              this.router.navigate(['../'], {relativeTo: this.route});
            }
          )
          .subscribe(
            () => this.actuatorService.removeActuator(+this.id),
            (err) => console.log(err)
          );
      }
    });
  }

  onLockActuator() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'BLOQUEAR';
    this.modalService.open(this.confirmModal).result.then((lock) => {
      if (lock) {
        this.actLoading = true;
        this.actuatorService.updateActuator(+this.id, {lock: 1})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (actuator: Actuator) => this.actuatorService.setActuator(+this.id, actuator),
            (err) => console.log(err)
          );
      }
    });
  }

  onUnlockActuator() {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'DESBLOQUEAR';
    this.modalService.open(this.confirmModal).result.then((unlock) => {
      if (unlock) {
        this.actLoading = true;
        this.actuatorService.updateActuator(+this.id, {lock: 0})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (actuator: Actuator) => this.actuatorService.setActuator(+this.id, actuator),
            (err) => console.log(err)
          );
      }
    });
  }

}
