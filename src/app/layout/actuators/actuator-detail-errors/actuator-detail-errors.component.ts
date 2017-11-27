import { Component, Input, OnInit } from '@angular/core';
import { ActuatorService } from '../actuator.service';
import { SPUError } from '../../../models/spu-error.model';

@Component({
  selector: 'app-actuator-detail-errors',
  templateUrl: './actuator-detail-errors.component.html',
  styleUrls: ['./actuator-detail-errors.component.scss']
})
export class ActuatorDetailErrorsComponent implements OnInit {
  @Input() id: number;
  errors: SPUError[] = [];
  loading = true;
  subLoading = true;
  page = 1;
  limit = 10;

  constructor(private actuatorService: ActuatorService) { }

  ngOnInit() {
    this.getErrors(this.page);
  }

  getErrors(page: number) {
    this.actuatorService.getErrors(this.id, page)
      .subscribe(
        (errors: SPUError[]) => {
          this.errors = errors;
          this.loading = false;
          this.subLoading = false;
        },
        (err) => console.log(err)
      );
  }

  getNext() {
    this.page++;
    this.getErrors(this.page);
  }

  getPrev() {
    this.page--;
    this.getErrors(this.page);
  }

}
