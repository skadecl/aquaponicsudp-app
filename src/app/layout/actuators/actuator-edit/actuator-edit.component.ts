import { Component, OnInit, ViewChild } from '@angular/core';
import { ActuatorService } from '../actuator.service';
import { Actuator } from '../../../models/actuator.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-actuator-edit',
  templateUrl: './actuator-edit.component.html',
  styleUrls: ['./actuator-edit.component.scss']
})
export class ActuatorEditComponent implements OnInit {

  @ViewChild('eacm') editActuator;
  @ViewChild('dm') dialogModal;
  dialogMessage: string;
  actuator: Actuator;
  originalName: string;
  modalInstance: NgbModalRef;
  validated = false;
  selectedIcon = '';
  selectedColor = '';
  saving = false;
  edit: boolean;
  changes: boolean;

  constructor(private actuatorService: ActuatorService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: NgbModal
  ) {}

  ngOnInit() {
  }

  openModal(edit: boolean = false, actuator = null) {
    this.edit = edit;
    if (this.edit) {
      this.changes = false;
      this.actuator = {...actuator};
      this.originalName = actuator.name;
    } else {
      this.actuator = new Actuator();
    }
    this.selectedIcon = this.actuator.icon;
    this.selectedColor = this.actuator.style;
    this.validated = false;
    this.modalInstance = this.modalService.open(this.editActuator);
  }

  onSelectIcon(icon: string) {
    this.selectedIcon = icon;
    this.changes = true;
  }

  onSelectColor(color: string) {
    this.selectedColor = color;
    this.changes = true;
  }

  onCreateActuator(form) {
    this.validated = true;
    if (form.valid) {
      if (this.edit && this.changes) {
        this.saving = true;
        this.actuatorService.updateActuator(this.actuator.id, form.value)
          .finally(
            () => {
              this.saving = false;
              this.dialogMessage = 'Los cambios han sido guardados';
              this.modalService.open(this.dialogModal);
            }
          )
          .subscribe(
            (actuator: Actuator) => {
              this.actuatorService.setActuator(this.actuator.id, actuator);
              this.modalInstance.close();
            },
            (err) => console.log(err)
          );
      } else {
        this.saving = true;
        this.actuatorService.createActuator(form.value)
          .finally(
            () => this.saving = false
          )
          .subscribe(
            (actuator: Actuator) => {
              this.actuatorService.addActuator(actuator);
              this.modalInstance.close();
            },
            (err) => console.log(err)
          );
      }
    }
  }

  dialog(message: string) {
    this.dialogMessage = message;
    this.modalService.open(this.dialogModal);
  }

  // onValidateName(name, form) {
  //   if (form.form.controls.name.errors == null) {
  //     if (name === this.originalName) {
  //       form.form.controls.name.setErrors(null);
  //     } else {
  //       this.actuatorService.checkActuatorName(name)
  //         .subscribe(
  //           () => {},
  //           (res: Response) => {
  //             if (res.status === 200) {
  //               form.form.controls.name.setErrors({nameExists: true});
  //             } else {
  //               form.form.controls.name.setErrors(null);
  //             }
  //           }
  //         );
  //     }
  //   }
  // }
}
