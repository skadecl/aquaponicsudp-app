import { Component, Input, OnInit } from '@angular/core';
import { SensorService } from '../sensor.service';
import { SPUError } from '../../../models/spu-error.model';

@Component({
  selector: 'app-detail-sensor-errors',
  templateUrl: './detail-sensor-errors.component.html',
  styleUrls: ['./detail-sensor-errors.component.scss']
})
export class DetailSensorErrorsComponent implements OnInit {
  @Input() id: number;
  errors: SPUError[] = [];
  loading = true;

  constructor(private sensorService: SensorService) { }

  ngOnInit() {
    this.getErrors();
  }

  getErrors() {
    this.sensorService.getErrors(this.id)
      .subscribe(
        (errors: SPUError[]) => {
          this.errors = errors;
          this.loading = false;
        },
        (err) => console.log(err)
      );
  }

}
