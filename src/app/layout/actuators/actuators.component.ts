import { Component, OnInit, ViewChild } from '@angular/core';
import { ActuatorService } from './actuator.service';
import { Actuator } from '../../models/actuator.model';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActuatorEditComponent } from './actuator-edit/actuator-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-actuators',
  templateUrl: './actuators.component.html',
  styleUrls: ['./actuators.component.scss']
})
export class ActuatorsComponent implements OnInit {
  actuators: Actuator[];
  subscription: Subscription;
  confirmText: string;
  @ViewChild('cm') confirmModal;
  @ViewChild('dm') dialogModal;
  dialogMessage: string;
  loading = true;
  refreshing = false;
  actLoading = false;
  @ViewChild(ActuatorEditComponent) editActuator;

  constructor(private actuatorService: ActuatorService,
              private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService
  ) { }

  ngOnInit() {
    this.actuators = this.actuatorService.getActuators();
    if (this.actuators) { this.loading = false; }

    this.subscription = this.actuatorService.actuatorsChanged
      .subscribe(
        () => {
          this.actuators = this.actuatorService.getActuators();
          if (this.actuators) { this.loading = this.refreshing = false; }
        },
        (err) => console.log(err)
      );
  }

  dialog(message: string) {
    this.dialogMessage = message;
    this.modalService.open(this.dialogModal);
  }

  onRefresh() {
    this.refreshing = true;
    this.actuatorService.fetchActuators();
  }

  onEnterActuator(id: number) {
    if (!this.loading && !this.refreshing) {
      this.router.navigate([id], {relativeTo: this.route});
    }
  }

  onEnableActuator(id: number) {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'ENCENDER';
    this.modalService.open(this.confirmModal).result.then((enable) => {
      if (enable) {
        this.actLoading = true;
        this.actuatorService.updateActuator(+id, {status: 1, lock: 1})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (actuator: Actuator) => this.actuatorService.setActuator(+id, actuator),
            (err) => console.log(err)
          );
      }
    });
  }

  onDisableActuator(id: number) {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'APAGAR';
    this.modalService.open(this.confirmModal).result.then((disable) => {
      if (disable) {
        this.actLoading = true;
        this.actuatorService.updateActuator(+id, {status: 0, lock: 1})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (actuator: Actuator) => this.actuatorService.setActuator(+id, actuator),
            (err) => console.log(err)
          );
      }
    });
  }

  onLockActuator(id: number) {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'BLOQUEAR';
    this.modalService.open(this.confirmModal).result.then((lock) => {
      if (lock) {
        this.actLoading = true;
        this.actuatorService.updateActuator(+id, {lock: 1})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (actuator: Actuator) => this.actuatorService.setActuator(+id, actuator),
            (err) => console.log(err)
          );
      }
    });
  }

  onUnlockActuator(id: number) {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'DESBLOQUEAR';
    this.modalService.open(this.confirmModal).result.then((unlock) => {
      if (unlock) {
        this.actLoading = true;
        this.actuatorService.updateActuator(+id, {lock: 0})
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            (actuator: Actuator) => this.actuatorService.setActuator(+id, actuator),
            (err) => console.log(err)
          );
      }
    });
  }

  onDeleteActuator(id: number) {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.confirmText = 'ELIMINAR';
    this.modalService.open(this.confirmModal).result.then((remove) => {
      if (remove) {
        this.actLoading = true;
        this.actuatorService.deleteActuator(id)
          .finally(
            () => this.actLoading = false
          )
          .subscribe(
            () => this.actuatorService.removeActuator(id),
            (err) => console.log(err)
          );
      }
    });
  }

  onEditActuator(actuator: Actuator) {
    if (!this.auth.user['role']) {
      this.dialog('No tienes permisos suficientes');
      return;
    }
    this.editActuator.openModal(true, actuator);
  }




}
