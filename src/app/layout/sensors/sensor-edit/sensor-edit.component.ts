import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SensorService } from '../sensor.service';
import { Sensor } from '../../../models/sensor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sensor-edit',
  templateUrl: './sensor-edit.component.html',
  styleUrls: ['./sensor-edit.component.scss']
})
export class SensorEditComponent implements OnInit {

  @ViewChild('esm') editSensorModal;
  sensor: Sensor;
  originalName: string;
  modalInstance: NgbModalRef;
  validated = false;
  selectedIcon = '';
  selectedColor = '';
  saving = false;
  edit: boolean;

  constructor(private sensorService: SensorService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: NgbModal
  ) {}

  ngOnInit() {
  }

  openModal(edit: boolean = false, sensor = null) {
    this.edit = edit;
    if (this.edit) {
      this.sensor = {...sensor};
      this.originalName = sensor.name;
    } else {
      this.sensor = new Sensor();
    }
    this.selectedIcon = this.sensor.icon;
    this.selectedColor = this.sensor.style;
    this.validated = false;
    this.modalInstance = this.modalService.open(this.editSensorModal);
  }

  onSelectIcon(icon: string) {
    this.selectedIcon = icon;
  }

  onSelectColor(color: string) {
    this.selectedColor = color;
  }

  onCreateSensor(form) {
    this.validated = true;
    if (form.valid) {
      this.saving = true;
      if (this.edit) {
        this.sensorService.updateSensor(this.sensor.id, form.value)
          .finally(
            () => this.saving = false
          )
          .subscribe(
            (sensor: Sensor) => {
              this.sensorService.setSensor(this.sensor.id, sensor);
              this.modalInstance.close();
            },
            (err) => console.log(err)
          );
      } else {
        this.sensorService.createSensor(form.value)
          .finally(
            () => this.saving = false
          )
          .subscribe(
            (sensor: Sensor) => {
              this.sensorService.addSensor(sensor);
              this.modalInstance.close();
            },
            (err) => console.log(err)
          );
      }
    }
  }

  onValidateName(name, form) {
    if (form.form.controls.name.errors == null) {
      if (name === this.originalName) {
        form.form.controls.name.setErrors(null);
      } else {
        this.sensorService.checkSensorName(name)
          .subscribe(
            () => {},
            (res: Response) => {
              if (res.status === 200) {
                form.form.controls.name.setErrors({nameExists: true});
              } else {
                form.form.controls.name.setErrors(null);
              }
            }
          );
      }
    }
  }
}
